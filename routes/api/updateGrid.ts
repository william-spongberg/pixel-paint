import { Handlers } from "$fresh/server.ts";
import { CellType } from "../../global/types.ts";
import { GRID, GRID_SIZE } from "../../global/constants.ts";
import { notifyClients } from "./websocket.ts";

// fix deno fresh build infinite hang
let kv: any = null;
const isBuildMode = Deno.args.includes("build");
if (!isBuildMode) {
  kv = await Deno.openKv();
}

// batching
const BATCH_SIZE = 10;
const BATCH_DELAY_MS = 100;
let batchTimer: number | null = null;

// post queue
const postQueue: CellType[] = [];
let isProcessingQueue = false;

export const handler: Handlers<CellType> = {
  async GET(_req, _ctx) {
    const grid = await kv.get(["grid"]);

    if (!grid.value || (grid.value as CellType[]).length !== GRID_SIZE) {
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

    // add to queue
    postQueue.push({ index, colour });

    // if batch size reached, process immediately.
    if (postQueue.length >= BATCH_SIZE && !isProcessingQueue) {
      if (batchTimer) {
        clearTimeout(batchTimer);
        batchTimer = null;
      }
      processPostQueue();
    } else if (!batchTimer) {
      // otherwise, schedule processing after short delay
      batchTimer = setTimeout(() => {
        processPostQueue();
        batchTimer = null;
      }, BATCH_DELAY_MS);
    }

    return new Response("Colour set successfully", { status: 200 });
  },

  async DELETE(_req, _ctx) {
    await kv.delete(["grid"]);
    console.log("Grid deleted");

    notifyClients(GRID);

    return new Response("Grid deleted", { status: 200 });
  },
};

async function initialiseGrid() {
  await kv.set(["grid"], GRID);
  console.log("Initialised grid with default colours");

  return GRID;
}

async function processPostQueue() {
  if (isProcessingQueue) return;
  isProcessingQueue = true;

  // empty queue into batch
  const batch: CellType[] = [];
  while (postQueue.length) {
    batch.push(postQueue.shift() as CellType);
  }

  const grid: any = await kv.get(["grid"]);
  if (!grid.value) {
    grid.value = await initialiseGrid();
  }

  // only one kv.get & kv.set per batch
  batch.forEach(({ index, colour }) => {
    grid.value[index].colour = colour;
    console.log(`Cell ${index} set to ${colour}`);
  });

  await kv.set(["grid"], grid.value);
  notifyClients(grid.value);

  isProcessingQueue = false;
}
