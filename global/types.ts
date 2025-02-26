import { ComponentChildren } from "preact";

export interface ChildrenProps {
  children: ComponentChildren;
}

export interface Pixel {
  colour: string;
  index: number;
  timestamp?: number;
}
