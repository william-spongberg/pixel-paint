import { CELL_SIZE, GRID_WIDTH } from "../global/constants.ts";
import { CellType } from "../global/types.ts";
import Cell from "./Cell.tsx";
import { useEffect, useState } from "preact/hooks";

export default function Grid() {
  const [grid, setGrid] = useState<CellType[]>([]);

  async function initGrid() {
    // fetch grid from kv
    try {
      const response = await fetch("/api/updateGrid");
      const initialGrid = (await response.json()) as CellType[];
      setGrid([...initialGrid]);
    } catch (error) {
      console.error("Error getting grid:", error);
    }
  }

  function updateGrid(ws: WebSocket) {
    // update grid when notified
    ws.onmessage = (e) => {
      // receive array of updated cells, sort by timestamp and apply accordingly
      const data = JSON.parse(e.data) as CellType[];
      data.sort(compareCells);

      setGrid((prevGrid) =>
        prevGrid.map((cell, index) => {
          const updatedCell = data.find((newCell) => newCell.index === index);
          return updatedCell ? { ...updatedCell } : { ...cell };
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
    const cleanup = updateGrid(ws);

    return cleanup;
  }, []);

  useEffect(() => {
    console.log("Updating grid!");
  }, [grid]);

  return (
    <div
      class="sm:scale-100 scale-75"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${GRID_WIDTH}, ${CELL_SIZE}px)`,
        width: "100%",
      }}
    >
      {grid?.map((cell) => (
        <Cell key={`cell-${cell.index}-${cell.timestamp}`} {...cell} />
      ))}
    </div>
  );
}

function compareCells(a: CellType, b: CellType) {
  if (a.timestamp && b.timestamp) {
    return a.timestamp < b.timestamp ? -1 : 1;
  }
  console.error("timestamp does not exist on cells, sorting by index");
  return a.index < b.index ? -1 : 1;
}
