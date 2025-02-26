import { PIXEL_SIZE, GRID_LENGTH } from "../global/constants.ts";
import { Pixel } from "../global/types.ts";
import PixelCell from "./PixelCell.tsx";
import { useEffect, useState } from "preact/hooks";

export default function PixelGrid() {
  const [grid, setGrid] = useState<Pixel[]>([]);

  async function initGrid() {
    // fetch grid from kv
    try {
      const response = await fetch("/api/updateGrid");
      const initialGrid = (await response.json()) as Pixel[];
      setGrid([...initialGrid]);
    } catch (error) {
      console.error("Error getting grid:", error);
    }
  }

  function subscribeGridUpdates(ws: WebSocket) {
    // update grid when notified
    ws.onmessage = (e) => {
      // receive array of updated pixels, sort by timestamp and apply accordingly
      const data = JSON.parse(e.data) as Pixel[];
      data.sort(comparePixels);

      setGrid((prevGrid) =>
        prevGrid.map((pixel, index) => {
          const updatedPixel = data.find((newPixel) => newPixel.index === index);
          return updatedPixel ? { ...updatedPixel } : { ...pixel };
        })
      );
    };

    // close websocket on exiting page
    return () => {
      ws.close();
    };
  }

  // run once on mount
  useEffect(() => {
    initGrid();
    const url = new URL(`/api/websocket`, globalThis.location.href);
    url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(url);
    const subscribe = subscribeGridUpdates(ws);

    return subscribe;
  }, []);

  useEffect(() => {
    console.log("Updating grid!");
  }, [grid]);

  return (
    <div
      class="sm:scale-100 scale-75"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${GRID_LENGTH}, ${PIXEL_SIZE}px)`,
        width: "100%",
      }}
    >
      {/* have to make sure keys are updated like this or they aren't redrawn?? */}
      {grid?.map((pixel) => (
        <PixelCell key={`pixel-${pixel.index}-${pixel.timestamp}`} {...pixel} />
      ))}
    </div>
  );
}

function comparePixels(a: Pixel, b: Pixel) {
  if (a.timestamp && b.timestamp) {
    return a.timestamp < b.timestamp ? -1 : 1;
  }
  console.error("timestamp does not exist on pixels, sorting by index");
  return a.index < b.index ? -1 : 1;
}
