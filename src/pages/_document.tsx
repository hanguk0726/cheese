import { Html, Head, Main, NextScript } from "next/document";
import createEmotionServer from '@emotion/server/create-instance';
import { createEmotionCache } from '@/utils/createEmotionCache';

export default function Document() {
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  return (
    <Html lang="en">
      <Head>
        <meta name="emotion-insertion-point" content="" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
