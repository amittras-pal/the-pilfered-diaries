import { INSTA_HANDLE, INSTA_LINK, SITE_TITLE } from "@constants/app";
import { IconBrandInstagram } from "@tabler/icons-react";
import { SiteImageCfg } from "@typeDefs/entities";

export default function Header({ cfg }: { cfg: SiteImageCfg }) {
  return (
    <header
      className="hero bg-base-200 relative h-[75vh] md:h-[50vh]"
      style={{ backgroundImage: `url(${cfg.siteHeader.url})` }}
    >
      <div className="hero-content text-center backdrop-blur-sm rounded-md shadow-sm">
        <div className="max-w-xl">
          <h1 className="text-5xl md:text-7xl text-white">{SITE_TITLE}</h1>
          <p className="py-6 font-light text-lg md:text-xl text-violet-300">
            When a thinker finds his lost words, <br />
            stories happen!
          </p>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={INSTA_LINK}
            className="btn btn-ghost btn-sm gap-0"
          >
            <IconBrandInstagram />
            <span className="normal-case">{INSTA_HANDLE}</span>
          </a>
        </div>
      </div>
      <div className="font-body absolute bottom-2 right-2 px-2 py-1 rounded bg-gray-500/40 backdrop-blur-md text-xs text-gray-300">
        Image By: {cfg.siteHeader.credit}
      </div>
    </header>
  );
}
