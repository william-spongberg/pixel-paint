import { useEffect, useState } from "preact/hooks";
import { CellType } from "../global/types.ts";
import { CELL_SIZE } from "../global/constants.ts";
import { getColourFromDB } from "../global/utils.ts";

export default function Cell({ colour: initialColour, index }: CellType) {
  const [colour, setColour] = useState(initialColour);
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
      setColour(newColour);
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
