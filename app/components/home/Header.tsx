import React from "react";
import { IconBrandInstagram } from "@tabler/icons-react";
import { SiteImageConfig } from "../../types/entities";
import { INSTA_HANDLE, INSTA_LINK, SITE_TITLE } from "../../constants";

interface IHeaderProps {
  data: SiteImageConfig;
}

export default function Header(props: IHeaderProps) {
  return (
    <div
      className="hero h-[75vh] md:h-[50vh] bg-base-200 shadow-md relative"
      style={{ backgroundImage: `url(${props.data.siteHeader.url})` }}
    >
      <div className="hero-content text-center">
        <div className="max-w-xl">
          <h1 className="text-6xl font-serif text-white">{SITE_TITLE}</h1>
          <p className="py-6 font-thin text-lg text-purple-300">
            When a thinker finds his lost words!
          </p>
          <a
            className="btn btn-ghost btn-sm normal-case gap-0"
            target="_blank"
            href={INSTA_LINK}
            rel="noreferrer"
          >
            <IconBrandInstagram />
            {INSTA_HANDLE}
          </a>
        </div>
      </div>
      <div className="absolute bottom-2 right-2">
        <p className="text-xs text-gray-100 bg-gray-800/40 backdrop-blur-sm px-2 py-1 rounded">
          Picture Credit: {props.data.siteHeader.credit}
        </p>
      </div>
    </div>
  );
}
