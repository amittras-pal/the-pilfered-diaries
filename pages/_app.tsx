import Navbar from "@components/Navbar";
import Analytics from "@components/client/Analytics";
import ScrollReset from "@components/client/ScrollReset";
import { SITE_DESCRIPTION_ROOT, SITE_TITLE, SITE_URL } from "@constants/app";
import "@styles/globals.css";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import SubscribeModal from "../components/client/SubscribeModal";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo
        title={SITE_TITLE}
        description={SITE_DESCRIPTION_ROOT}
        openGraph={{
          type: "website",
          locale: "en_IN",
          url: SITE_URL,
          siteName: SITE_TITLE,
          description: SITE_DESCRIPTION_ROOT,
          title: SITE_TITLE,
        }}
        additionalMetaTags={[
          {
            name: "viewport",
            content:
              "minimum-scale=1, maximum-scale=1, initial-scale=1, width=device-width",
          },
        ]}
      />
      <ScrollReset />
      <Analytics />
      <Navbar />
      <SubscribeModal />
      <main className="grow overflow-y-auto scroll-smooth" id="main">
        <Component {...pageProps} />
      </main>
    </>
  );
}
