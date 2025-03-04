import { Handlers } from "$fresh/server.ts";
import { Pixel } from "../../global/types.ts";
import { GRID, GRID_SIZE } from "../../global/constants.ts";
import { notifyClients } from "./websocket.ts";

// fix deno fresh build infinite hang
let kv: any = null;
const isBuildMode = Deno.args.includes("build");
if (!isBuildMode) {
  kv = await Deno.openKv();
}

// batching
const MAX_BATCH_SIZE = 50;
const MIN_BATCH_SIZE = 5;
const MAX_BATCH_DELAY = 300;
const MIN_BATCH_DELAY = 50;
const TARGET_AVG_DELAY = 150;
const ADJUSTMENT_PERIOD = 10;
let batchSize = 10;
let batchDelay = 100;
let batchTimer: number | null = null;

// post queue
const pixelQueue: Pixel[] = [];
let isProcessing = false;

// tracking metrics
let totalBatches = 0;
let totalProcessedPixels = 0;
let totalProcessingDelayMS = 0;


export const handler: Handlers<Pixel> = {
  async GET(_req, _ctx) {
    const grid = await kv.get(["grid"]);

    if (!grid.value || (grid.value as Pixel[]).length !== GRID_SIZE) {
      const initialGrid = await initialiseGrid();
      return new Response(JSON.stringify(initialGrid), { status: 200 });
    }

    return new Response(JSON.stringify(grid.value), { status: 200 });
  },

  async POST(req, _ctx) {
    const { index, colour } = await req.json();

    if (typeof index !== "number") {
      return new Response("Index must be a number", { status: 400 });
    }

    if (typeof colour !== "string") {
      return new Response("Colour must be a string", { status: 400 });
    }

    // add to queue, write current timestamp (note timestamp can still overlap)
    pixelQueue.push({ index, colour, timestamp:Date.now()});

    // if batch size reached, process immediately.
    if (pixelQueue.length >= batchSize && !isProcessing) {
      if (batchTimer) {
        clearTimeout(batchTimer);
        batchTimer = null;
      }
      processPixelQueue();
    } else if (!batchTimer) {
      // otherwise, schedule processing after short delay
      batchTimer = setTimeout(() => {
        processPixelQueue();
        batchTimer = null;
      }, batchDelay);
    }

    return new Response("Colour set successfully", { status: 200 });
  },

  async DELETE(_req, _ctx) {
    await kv.delete(["grid"]);
    console.log("Grid deleted");

    notifyClients(GRID);

    return new Response("Grid deleted successfully", { status: 200 });
  },
};

async function initialiseGrid() {
  // set kv to default GRID array (all white)
  await kv.set(["grid"], GRID);
  console.log("Initialised grid with default colours");

  return GRID;
}

function adjustBatch(currentAvgDelay: number) {
  // adjust every 10 batches
  if (totalBatches % ADJUSTMENT_PERIOD !== 0) return;
  
  const prevBatchSize = batchSize;
  const prevBatchDelay = batchDelay;
  
  if (currentAvgDelay > TARGET_AVG_DELAY * 1.2) {
    // if high delay, increase batch size
    batchSize = Math.min(MAX_BATCH_SIZE, batchSize + 2);
    batchDelay = Math.max(MIN_BATCH_DELAY, batchDelay - 10);
  } else if (currentAvgDelay < TARGET_AVG_DELAY * 0.8) {
    // low delay, decrease batch size
    batchSize = Math.max(MIN_BATCH_SIZE, batchSize - 1);
    batchDelay = Math.min(MAX_BATCH_DELAY, batchDelay + 5);
  }
  
  // log updated params
  if (prevBatchSize !== batchSize || prevBatchDelay !== batchDelay) {
    console.log(`Auto-scaling: Adjusted batch parameters - Size: ${prevBatchSize} → ${batchSize}, Delay: ${prevBatchDelay}ms → ${batchDelay}ms`);
  }
}

async function processPixelQueue() {
  if (isProcessing) return;
  isProcessing = true;

  // empty current queue into batch
  const batch: Pixel[] = [];
  while (pixelQueue.length) {
    batch.push(pixelQueue.shift() as Pixel);
  }

  // get current time for metrics
  const now = Date.now();
  let batchDelayMS = 0;

  // grab grid from kv
  const grid: any = await kv.get(["grid"]);
  if (!grid.value) {
    grid.value = await initialiseGrid();
  }

  // update kv with new pixel changes
  batch.forEach(({ index, colour, timestamp }) => {
    grid.value[index].colour = colour;
    console.log(`Pixel ${index} set to ${colour}`);
    
    // calc delay for this pixel
    if (timestamp) {
      batchDelayMS += (now - timestamp);
    }
  });
  await kv.set(["grid"], grid.value);

  // update metrics
  totalBatches++;
  totalProcessedPixels += batch.length;
  totalProcessingDelayMS += (batchDelayMS / batch.length);
  
  // log metrics
  const avgBatchSize = totalProcessedPixels / totalBatches;
  const avgDelayMS = totalProcessingDelayMS / totalBatches;
  console.log(`Batch metrics: Size=${batch.length}, Avg Size=${avgBatchSize.toFixed(2)}, Avg Delay=${avgDelayMS.toFixed(2)}ms`);

  // auto-scale batch size + delay based on current average delay
  adjustBatch(avgDelayMS);

  // notify clients of all altered pixels
  notifyClients(batch);

  isProcessing = false;
}