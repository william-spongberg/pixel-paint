import { useEffect, useState } from "preact/hooks";
import { Pixel } from "../global/types.ts";
import { PIXEL_SIZE } from "../global/constants.ts";
import { getColourFromDB } from "../global/utils.ts";

export default function PixelCell({ colour: initialColour, index }: Pixel) {
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
        console.error("Error posting updated pixel:", error);
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
      type = "button"
      style={{
        backgroundColor: colour,
        width: `${PIXEL_SIZE}px`,
        height: `${PIXEL_SIZE}px`,
      }}
      onMouseDown={handleClick}
      onMouseEnter={handleMouseEnter}
    >
    </button>
  );
}
