import { ComponentChildren } from "preact";

export interface ChildrenProps {
  children: ComponentChildren
}

export interface ColourProps {
  colour: string;
}

export interface CellType {
  colour: string;
  index: number;
}