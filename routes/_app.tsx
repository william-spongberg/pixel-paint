import { type PageProps } from "$fresh/server.ts";
import * as Layout from "../components/Layout.tsx";

export default function App({ Component }: PageProps) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Pixel Painting</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <Component />
        <Layout.Footer author="William Spongberg" />
      </body>
    </html>
  );
}
