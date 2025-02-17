import { useState } from "preact/hooks";
import { setColourInDB } from "../global/utils.ts";

export default function ColourPicker() {
  const [colour, setColour] = useState("#000000");

  const handleChange = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const newColor = target.value;
    setColour(newColor);
    await setColourInDB(newColor);
  };

  return (
    <>
      <input
        type="color"
        class="size-20 bg-gray-800" /* same colour as element, loses border */
        value={colour}
        onChange={handleChange}
      />
    </>
  );
}
