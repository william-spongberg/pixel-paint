/// <reference lib="deno.unstable" />

import { Handlers } from "$fresh/server.ts";
import { CellType } from "../../global/types.ts";
import { GRID, GRID_SIZE } from "../../global/constants.ts";
import { WebSocketServer } from "npm:ws";

const kv = await Deno.openKv();
const wss = new WebSocketServer({ port: 8080 });

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

    const grid: any = await kv.get(["grid"]);
    
    if (!grid.value) {
      grid.value = await initialiseGrid();
    }

    grid.value[index].colour = colour;
    await kv.set(["grid"], grid.value);

    console.log(`Cell ${index} set to ${colour}`);

    notifyClients(grid.value);

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
  console.log("Initialized grid with default colours");

  return GRID;
}

export function notifyClients(grid: CellType[]) {
  wss.clients.forEach((client: any) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(grid));
    }
  });
  console.log("Notified clients of grid update");
}