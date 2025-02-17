import { CELL_SIZE, GRID_WIDTH } from "../global/constants.ts";
import { CellType } from "../global/types.ts";
import Cell from "./Cell.tsx";
import { useEffect, useState } from "preact/hooks";

export default function Grid() {
  const [grid, setGrid] = useState<CellType[] | null>(null);

  async function fetchGrid() {
    console.log("Fetching grid!");
    const response = await fetch("/api/updateGrid");
    const newGrid = await response.json() as CellType[];
    setGrid(newGrid);
  }

  function updateGrid() {
    const url = `ws://${globalThis.location.hostname}:8080`;
    console.log("Connecting to WebSocket server at", url);
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("WebSocket connection established!");
    };

    ws.onmessage = (e) => {
      console.log("Received update!");
      const data = JSON.parse(e.data) as CellType[];
      setGrid(data);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed!");
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

    const unsubscribe = updateGrid();
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${GRID_WIDTH}, ${CELL_SIZE}px)`,
        gap: "1px",
        width: "100%",
      }}
    >
      {grid && grid.map((cell) => <Cell {...cell} />)}
    </div>
  );
}