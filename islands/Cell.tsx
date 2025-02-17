import { CellType } from "../global/types.ts";
import { CELL_SIZE } from "../global/constants.ts";

export default function Cell({ colour, index }: CellType) {
  const handleClick = async () => {
    const response = await fetch("/api/updateColour");
    const newColour = await response.json();

    try {
      await fetch("/api/updateGrid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          index,
          colour: newColour,
        }),
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <button
      style={{
        backgroundColor: colour,
        width: `${CELL_SIZE}px`,
        height: `${CELL_SIZE}px`,
      }}
      onClick={handleClick}
    >
    </button>
  );
}
