import { ComponentChildren } from "preact";
import * as Text from "../components/Text.tsx";
import Button from "../components/Button.tsx";
import * as Icons from "../components/Icons.tsx";

// colours
const BACKGROUND_COLOUR = "bg-black";
const HEADER_COLOUR = "bg-black";
const FOOTER_COLOUR = "bg-black";
const ELEMENT_COLOUR = "bg-gray-800";
const BUTTON_COLOUR = "bg-[#F0EBD8]";
const BUTTON_HOVER_COLOUR = "hover:bg-[#F0EBD0]";
const TEXT_COLOUR = "text-white";

// sizes
const ELEMENT_SIZE = "max-w-screen-md";

interface ChildrenProps {
  children: ComponentChildren;
}

interface PageProps {
  colour?: string;
  children: ComponentChildren;
}

export function Page({
  colour = BACKGROUND_COLOUR,
  children,
}: PageProps) {
  return (
    <div class={`flex flex-col min-h-screen ${colour}`}>
      <div
        class={`flex-grow flex items-center justify-center mb-9 px-4 sm:px-8 pt-8 pb-8`}
      >
        {children}
      </div>
    </div>
  );
}

interface ElementProps {
  children: ComponentChildren;
  title?: string;
  colour?: string;
  textColour?: string;
  size?: string;
}

export function Element({
  title = "",
  colour = ELEMENT_COLOUR,
  textColour = TEXT_COLOUR,
  size = ELEMENT_SIZE,
  children,
}: ElementProps) {
  return (
    <div
      class={`lg:px-16 sm:px-8 px-0 lg:py-16 sm:py-8 py-2 mx-auto my-auto ${colour} rounded-2xl w-full ${size}`}
    >
      <Center>
        <Text.Title textColour={textColour}>{title}</Text.Title>
        <br />
        {children}
        <br />
      </Center>
    </div>
  );
}

interface GridProps {
  customGridCols?: string;
  children: ComponentChildren;
}

export function Grid({ children }: GridProps) {
  return (
    <div
      class={`grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2`}
    >
      {children}
    </div>
  );
}

export function Center({ children }: ChildrenProps) {
  return <div class="flex flex-col justify-center items-center">{children}
  </div>;
}

interface HeaderProps {
  title?: string;
  colour?: string;
  textColour?: string;
}

export function Header({
  title = "",
  colour = HEADER_COLOUR,
  textColour = TEXT_COLOUR,
}: HeaderProps) {
  return (
    <>
      <header
        className={`flex items-center justify-start ${colour} pb-2 px-4`}
      >
        {title && (
          <Text.Title textColour={textColour}>
            {title}
          </Text.Title>
        )}
        <div class="ml-auto gap-2 flex">
          <Button href="mailto:william@spongberg.dev">
            <Icons.Email />
          </Button>
          <Button href="https://www.linkedin.com/in/william-spongberg/">
            <Icons.LinkedIn />
          </Button>
          <Button href="https://github.com/william-spongberg">
            <Icons.GitHub />
          </Button>
        </div>
      </header>
    </>
  );
}

interface FooterProps {
  colour?: string;
  textColour?: string;
  author?: string;
}

export function Footer({
  colour = FOOTER_COLOUR,
  textColour = "text-gray-400",
  author = "",
}: FooterProps) {
  return (
    <>
      <footer
        class={`flex flex-col items-center w-auto ${colour} ${textColour}`}
      >
        <div class="flex flex-col md:flex-row justify-center items-center h-auto md:h-16 p-4 md:p-2 pb-16 md:pb-2">
        <p class="mb-2 md:mb-0">
        Created by{" "}
        <a
          href="https://github.com/william-spongberg"
          class="text-blue-500 hover:underline"
        >
          {author}
        </a>
        </p>
        <p class="hidden md:block mx-2">|</p>
        <p>
        &copy; {author}{" "}
        {new Date().getFullYear()}. All rights reserved.
        </p>
      </div>
      </footer>
    </>
  );
}
