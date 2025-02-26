import { Head } from "$fresh/runtime.ts";
import * as Layout from "../components/Layout.tsx";
import * as Text from "../components/Text.tsx";
import PixelGrid from "../islands/PixelGrid.tsx";
import ColourPicker from "../islands/ColourPicker.tsx";

export default function Pixels() {
  return (
    <>
      <Head>
        <title>Time to Paint!</title>
      </Head>
      <Layout.Page>
        <Layout.Grid>
          <Layout.Element size="max-w-screen-2xl">
            <Text.Heading>
              Time to Paint!
            </Text.Heading>
            <Text.Paragraph>
              Pick a colour, then click/drag to paint
            </Text.Paragraph>
            <br />
            <PixelGrid />
          </Layout.Element>

          <Layout.Element size="max-w-sm">
            <Text.Paragraph>
              Pick a colour
            </Text.Paragraph>
            <br />
            <ColourPicker />
          </Layout.Element>
        </Layout.Grid>
      </Layout.Page>
    </>
  );
}
