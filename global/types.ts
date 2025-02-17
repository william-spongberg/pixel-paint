import { ComponentChildren } from "preact";

export interface ChildrenProps {
  children: ComponentChildren
}

export interface CellType {
  colour: string;
  index: number;
}