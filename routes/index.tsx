import Button from "../components/Button.tsx";
import * as Layout from "../components/Layout.tsx";
import * as Text from "../components/Text.tsx";
import { Head } from "$fresh/runtime.ts";

export default function Home() {
  return (
    <>
      <Head>
        <title>Pixel Painting</title>
      </Head>

      <Layout.Background disableFooter={true}>
        <Layout.Element>
          <Text.Title>
            Pixel Painting
          </Text.Title>
          <br />
          <Button href="/pixels" text="Start">
          </Button>
        </Layout.Element>
      </Layout.Background>
    </>
  );
}
