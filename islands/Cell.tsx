import { useState, useEffect } from "preact/hooks";
import { CellType } from "../global/types.ts";
import { CELL_SIZE } from "../global/constants.ts";
import { getColourFromDB } from "../global/utils.ts";

export default function Cell({ colour, index }: CellType) {
  const [isMouseDown, setIsMouseDown] = useState(false);
  
  useEffect(() => {
    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    globalThis.addEventListener("mousedown", handleMouseDown);
    globalThis.addEventListener("mouseup", handleMouseUp);
    
    return () => {
      globalThis.removeEventListener("mousedown", handleMouseDown);
      globalThis.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);
  
  const handleClick = async () => {
    const newColour = await getColourFromDB();
    if (newColour) {
      colour = newColour;
      try {
        await fetch("/api/updateGrid", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            index,
            colour,
          }),
        });
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleMouseEnter = () => {
    if (isMouseDown) {
      handleClick();
    }
  };

  return (
    <button
      style={{
        backgroundColor: colour,
        width: `${CELL_SIZE}px`,
        height: `${CELL_SIZE}px`,
      }}
      onMouseDown={handleClick}
      onMouseEnter={handleMouseEnter}
    >
    </button>
  );
}