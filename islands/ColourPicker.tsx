import { useState } from "preact/hooks";

export default function ColourPicker() {
  const [color, setColor] = useState('#000000');
  localStorage.setItem('selectedColor', color);

  const handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const newColor = target.value;
    setColor(newColor);
    localStorage.setItem('selectedColor', newColor);
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