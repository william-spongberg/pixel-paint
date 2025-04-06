# Pixel Paint

This is a fun little website inspired by r/place that allows you to paint pixels
with users around the world! Uses Deno Fresh, Deno KV and WebSockets.

Find the deployment at <https://pixelpaint.spongberg.dev>

_Note: I realised far too late that Deno had already created their own version
of this - ah well!_

## How it works

### User Interaction

1. User opens site
2. User sends GET request for current [pixel grid](islands\PixelGrid.tsx)
3. User retrieves new grid
4. User opens [websocket](routes\api\websocket.ts) from user to server
5. User listens for notifications through WebSocket on updated pixels
6. Finally, user closes WebSocket on exit

### Pixels

1. [Pixel](islands\PixelCell.tsx) is clicked
2. Pixel sends a POST request to [server](routes\api\updateGrid.ts)
3. Server writes current timestamp on the pixel, adds pixel to update queue
4. If queue timer runs out or queue fills up, queue is processed:
   1. Grid is grabbed from kv
   2. Grid updated with each pixel in queue
   3. Updated grid is posted back to kv
5. All clients are notified with the batch of updated pixels, leaving each client to update and redraw their grid accordingly

### Colour Picker

1. User selects colour from [colour picker](islands\ColourPicker.tsx)
2. Value is written to [indexedDB](global\utils.ts) (Deno doesn't support cookie or web storage)
3. Colour is remembered when user next opens website

## Preventing Lag

The write KV is located in the US which does unfortunately add some permanent delay for all regions outside of this area. However, this can be accounted for by sending data in batches to avoid hitting rate limits, instantly displaying client-side changes to the grid and auto scaling the cutoffs for batch sizes and batch delays according to the current average delay.

---

### Developer Usage

Make sure to install Deno: <https://deno.land/manual/getting_started/installation>

Then start the project:

``` bash
deno task start
```

This will watch the project directory and restart as necessary.
