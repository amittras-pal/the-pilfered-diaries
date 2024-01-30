import { IconBrandInstagram } from "@tabler/icons-react";
import Image from "next/image";
import React from "react";

export default function About(props: { image: string }) {
  return (
    <div className="py-4 flex flex-col md:flex-row gap-4">
      <div className="basis-1/2 flex justify-center">
        <Image
          src={props.image}
          width={330}
          height={330}
          alt="Profile Pic"
          className="rounded-full"
        />
      </div>
      <div className="basis-1/2">
        <h2 className="text-4xl md:text-7xl text-purple-400">
          Hi! I am Amittras
        </h2>
        <p className="text-white text-xl my-3">
          The Pilfered Diaries is a place where I pen down the thoughts that
          come to my mind from all around me. I turn them to stories, sometimes
          little thoughts, and sometimes just a mess of words.
        </p>

        <p className="text-white text-xl mb-3">
          Come along if you too want to sneak a peek into the dark, sometimes
          funny, mostly twisted thinking process of my mind...
        </p>

        <p className="text-white text-xl mb-3">Find my work down below...</p>
        <a
          href="http://instagram.com/amittras_pal"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-sm btn-ghost w-full md:w-fit"
        >
          <IconBrandInstagram className="inline mr-2" />
          Follow me on Instagram
        </a>
      </div>
    </div>
  );
}
