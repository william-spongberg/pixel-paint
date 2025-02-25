import { CELL_SIZE, GRID_WIDTH } from "../global/constants.ts";
import { CellType } from "../global/types.ts";
import Cell from "./Cell.tsx";
import { useEffect, useState } from "preact/hooks";

export default function Grid() {
  const [grid, setGrid] = useState<CellType[] | null>(null);

  async function fetchGrid() {
    const response = await fetch("/api/updateGrid");
    const newGrid = await response.json() as CellType[];
    setGrid(newGrid);
  }

  function updateGrid() {
    const url = `/api/websocket`;
    const ws = new WebSocket(url);

    ws.onmessage = (e) => {
      console.log("Received update!");
      const data = JSON.parse(e.data) as CellType[];
      setGrid(data);
    };

    return () => {
      console.log("Closing WebSocket connection!");
      ws.close();
    };
  }

  useEffect(() => {
    const initialiseGrid = async () => {
      await fetchGrid();
    };
    initialiseGrid();

    const subscribe = updateGrid();
    return () => {
      subscribe();
    };
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${GRID_WIDTH}, ${CELL_SIZE}px)`,
        width: "100%",
      }}
    >
      {grid?.map((cell) => <Cell {...cell} />)}
    </div>
  );
}
