import { Head, Html, Main, NextScript } from "next/document";
import { DefaultSeo } from "next-seo";
import { SITE_DESCRIPTION_ROOT, SITE_TITLE, SITE_URL } from "../constants/app";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="icon"
          href="/favicon-w/favicon.ico"
          media="(prefers-color-scheme: dark)"
        />
        <link
          rel="icon"
          href="/favicon-b/favicon.ico"
          media="(prefers-color-scheme: light)"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Belleza&family=Crimson+Pro:ital,wght@0,200;0,400;0,600;0,700;0,800;1,200;1,400;1,600;1,700;1,800&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="h-screen w-scree">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
