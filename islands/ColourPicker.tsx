import { useState } from "preact/hooks";

export default function ColourPicker() {
  const [color, setColor] = useState("#000000");

  const handleChange = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const newColor = target.value;
    setColor(newColor);

    try {
      await fetch("/api/updateColour", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ colour: newColor }),
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <input
        type="color"
        class="size-20 bg-gray-800" /* same colour as element, loses border */
        value={color}
        onChange={handleChange}
      />
    </>
  );
}
