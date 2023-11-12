import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "../components/Navbar";
import ScrollReset from "../components/ScrollReset";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ScrollReset />
      <Navbar />
      <main className="grow overflow-y-auto scroll-smooth" id="main">
        <Component {...pageProps} />
      </main>
    </>
  );
}
