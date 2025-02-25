import { Handlers } from "$fresh/server.ts";
import { CellType } from "../../global/types.ts";

const clients = new Set<WebSocket>();

export const handler: Handlers = {
  GET(req, _ctx) {
    if (req.headers.get("upgrade") !== "websocket") {
      return new Response("Expected WebSocket", { status: 400 });
    }

    const { socket, response } = Deno.upgradeWebSocket(req);

    socket.onopen = () => {
      if (clients.has(socket)) {
        console.error("WebSocket already exists");
      }
      clients.add(socket);
      console.log("WebSocket connection established");
    };

    // this should be overwritten
    socket.onmessage = (e) => {
      console.log("WebSocket received message:", e.data);
    };

    socket.onerror = (e) => {
      console.error("WebSocket error:", e);
    };

    socket.onclose = () => {
      clients.delete(socket);
      console.log("WebSocket connection closed");
    };

    return response;
  },
};

// Use this function to notify all connected WebSocket clients
export function notifyClients(grid: CellType[]) {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(grid));
      console.log(`Notifed ${client.url} of grid update`)
    }
  });
}
