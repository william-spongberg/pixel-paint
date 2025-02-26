import { Pixel } from "./types.ts";

export const WHITE = "#FFFFFF";
export const BLACK = "#000000";

export const PIXEL_SIZE = 12;
export const GRID_LENGTH = 32;
export const GRID_HEIGHT = 32;
export const GRID_SIZE = GRID_LENGTH * GRID_HEIGHT;
export const GRID = Array.from({ length: GRID_SIZE }, (_, index) => ({
  index,
  colour: WHITE,
  timestamp: 0
})) as Pixel[];

export const DATABASE = "pixelDatabase";
export const STORE = "pixelStore";
