import { CellType } from "./types.ts";

export const WHITE = "#FFFFFF";
export const BLACK = "#000000";

export const CELL_SIZE = 15;
export const GRID_WIDTH = 32;
export const GRID_HEIGHT = 32;
export const GRID_SIZE = GRID_WIDTH * GRID_HEIGHT;
export const GRID = Array.from({ length: GRID_SIZE }, (_, index) => ({
  index,
  colour: WHITE,
})) as CellType[];

export const DATABASE = "pixelDatabase";
export const STORE = "pixelStore";