// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $api_updateGrid from "./routes/api/updateGrid.ts";
import * as $index from "./routes/index.tsx";
import * as $pixels from "./routes/pixels.tsx";
import * as $Cell from "./islands/Cell.tsx";
import * as $ColourPicker from "./islands/ColourPicker.tsx";
import * as $Grid from "./islands/Grid.tsx";
import type { Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/api/updateGrid.ts": $api_updateGrid,
    "./routes/index.tsx": $index,
    "./routes/pixels.tsx": $pixels,
  },
  islands: {
    "./islands/Cell.tsx": $Cell,
    "./islands/ColourPicker.tsx": $ColourPicker,
    "./islands/Grid.tsx": $Grid,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
