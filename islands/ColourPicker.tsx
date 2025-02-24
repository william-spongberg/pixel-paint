import { useEffect, useState } from "preact/hooks";
import { getColourFromDB, setColourInDB } from "../global/utils.ts";
import { BLACK } from "../global/constants.ts";

export default function ColourPicker() {
  const [colour, setColour] = useState(BLACK);

  useEffect(() => {
    const fetchColour = async () => {
      const dbColour = await getColourFromDB();
      if (dbColour) {
        setColour(dbColour);
      }
    };
    fetchColour();
  }, []);

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
        class="size-20 bg-gray-800"
        value={colour}
        onChange={handleChange}
      />
    </>
  );
}
