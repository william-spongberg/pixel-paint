import { ComponentChildren } from "preact";

interface ButtonProps {
  href: string;
  text: string;
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
  text,
  backgroundColour = "bg-blue-500",
  textColour = "text-white",
  hoverBackgroundColour = "hover:bg-blue-600",
  hoverTextColour = "hover:text-white",
  target = "_self",
  rel = "",
  children,
}: ButtonProps) {
  return (
    <a
      href={href}
      class={`flex items-center justify-center ${backgroundColour} rounded-2xl p-4 my-2 mt-4 ${hoverBackgroundColour} ${hoverTextColour} ${textColour}`}
      target={target}
      rel={rel}
    >
      <button class="w-full h-full">
        {children}
        {text}
      </button>
    </a>
  );
}
