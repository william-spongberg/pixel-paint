import { ComponentChildren } from "preact";
import * as Text from "./Text.tsx";
import { ChildrenProps } from "../global/types.ts";
import Button from "./Button.tsx";

const SCREEN_COLOUR = "bg-black";
const ELEMENT_COLOUR = "bg-gray-800";
const ELEMENT_SIZE = "max-w-screen-md";

interface BackgroundProps {
  disableFooter?: boolean;
  colour?: string;
  children: ComponentChildren;
}

export function Background(
  { colour = SCREEN_COLOUR, disableFooter = false, children }: BackgroundProps,
) {
  return (
    <div class={`flex flex-col min-h-screen ${colour}`}>
      <div class="flex-grow flex items-center justify-center mb-9 px-4 sm:px-8 pt-8 pb-8">
        {children}
      </div>
      <Footer disableFooter={disableFooter} />
    </div>
  );
}

interface ElementProps {
  children: ComponentChildren;
  title?: string;
  colour?: string;
  size?: string;
}

export function Element(
  {
    title = "",
    colour = ELEMENT_COLOUR,
    size = ELEMENT_SIZE,
    children,
  }: ElementProps,
) {
  return (
    <div
      class={`sm:px-8 px-0 sm:py-8 py-2 mx-auto my-auto ${colour} rounded-2xl w-full ${size}`}
    >
      <Center>
        <Text.Title>{title}</Text.Title>
        <br />
        {children}
        <br />
      </Center>
    </div>
  );
}

export function Grid({ children }: ChildrenProps) {
  return (
    <div class="grid sm:grid-cols-1 lg:grid-cols-2 gap-4 mt-4 mb-4">
      {children}
    </div>
  );
}

export function Center({ children }: ChildrenProps) {
  return (
    <div class="flex flex-col items-center">
      {children}
    </div>
  );
}

interface FooterProps {
  disableFooter?: boolean;
}

export function Footer({ disableFooter = false }: FooterProps) {
  return (
    <>
      <footer class="flex flex-col items-center w-auto bg-gray-900 text-white">
        {!disableFooter && (
          <Button
            href="/"
            text="Go back Home"
          />
        )}
        <div class="flex flex-col md:flex-row justify-center items-center h-auto md:h-16 p-4 md:p-2 pb-16 md:pb-2">
          <p class="text-yellow-500 mb-2 md:mb-0">This website is in beta.</p>
          <p class="hidden md:block mx-2">|</p>
          <p class="mb-2 md:mb-0">
            Made with ❤️ by{" "}
            <a
              href="https://github.com/william-spongberg"
              class="text-blue-500 hover:underline"
            >
              William Spongberg
            </a>
          </p>
          <p class="hidden md:block mx-2">|</p>
          <p>
            &copy; William Spongberg{" "}
            {new Date().getFullYear()}. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
