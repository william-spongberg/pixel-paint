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
    // don't want to await this
    processPostQueue();

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

  while (postQueue.length > 0) {
    const { index, colour } = postQueue.shift() as CellType;

    const grid: any = await kv.get(["grid"]);
    
    if (!grid.value) {
      grid.value = await initialiseGrid();
    }
    grid.value[index].colour = colour;
    await kv.set(["grid"], grid.value);

    console.log(`Cell ${index} set to ${colour}`);
    notifyClients(grid.value);
  }

  isProcessingQueue = false;
}