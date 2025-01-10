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
        <link href='//spoqa.github.io/spoqa-han-sans/css/SpoqaHanSansNeo.css' rel='stylesheet' type='text/css'></link>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""></link>
        <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet"></link>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
