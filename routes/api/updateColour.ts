import { Handlers } from "$fresh/server.ts";
import { BLACK } from "../../global/constants.ts";
import { ColourProps } from "../../global/types.ts";

// fix deno fresh build infinite hang
let kv: any = null;
const isBuildMode = Deno.args.includes("build");
if (!isBuildMode) {
  kv = await Deno.openKv();
}

export const handler: Handlers<ColourProps> = {
  async GET(_req, _ctx) {
    const colour = await kv.get(["colour"]);

    if (!colour.value) {
      await kv.set(["colour"], BLACK);
      return new Response(JSON.stringify(BLACK), { status: 200 });
    }

    return new Response(JSON.stringify(colour.value), { status: 200 });
  },

  async POST(req, _ctx) {
    const { colour } = await req.json();

    if (typeof colour !== "string") {
      return new Response("Colour must be a string", { status: 400 });
    }

    await kv.set(["colour"], colour);
    console.log(`Colour set to ${colour}`);

    return new Response("Colour set successfully", { status: 200 });
  }
};