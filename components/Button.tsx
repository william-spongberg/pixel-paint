import { ComponentChildren } from "preact";

export interface ButtonProps {
  href: string;
  textColour?: string;
  backgroundColour?: string;
  hoverBackgroundColour?: string;
  hoverTextColour?: string;
  target?: string;
  rel?: string;
  children?: ComponentChildren;
}

export default function Button({
  href,
  backgroundColour = "bg-white",
  textColour = "text-black",
  hoverBackgroundColour = "hover:bg-[#F0EBD8]",
  hoverTextColour = "hover:text-black",
  target = "_self",
  rel = "",
  children,
}: ButtonProps) {
  return (
    <a
      href={href}
      class={`flex items-center justify-center ${backgroundColour} rounded-xl px-3 py-2 my-2 mt-4 ${hoverBackgroundColour} ${hoverTextColour} ${textColour}`}
      target={target}
      rel={rel}
    >
      <button class="w-full h-full" type="button">
        {children}
      </button>
    </a>
  );
}
