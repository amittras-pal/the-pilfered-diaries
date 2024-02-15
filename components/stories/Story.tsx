import { StoryWOChaptersNContent } from "@typeDefs/page";
import Image from "next/image";
import Link from "next/link";
import StoryMeta from "../StoryMeta";
import TagsList from "../TagsList";

// TODO: add the indication for guest post!!
export default function Story(story: StoryWOChaptersNContent) {
  return (
    <article className="card card-compact md:card-side rounded-none border border-t-0 border-r-0 border-l-0 border-b-gray-700/90 last:border-b-transparent relative group">
      <figure className="p-2 pt-4 md:pt-2 basis-1/3">
        <Link href={`/stories/${story.slug}`}>
          <Image
            width={1280}
            height={720}
            src={story.cover}
            alt={story.slug + "-cover"}
            className="transition-all filter grayscale-75 group-hover:grayscale-0 focus:grayscale-0 rounded-xl shrink-0 outline-none"
          />
        </Link>
      </figure>
      <div className="card-body basis-2/3 gap-1 md:gap-2">
        <Link
          href={`/stories/${story.slug}`}
          className="card-title text-gray-200 hover:text-violet-400 focus:text-violet-400 outline-none transition-colors whitespace-nowrap"
        >
          {story.title}
        </Link>
        <p className="text-sm ">{story.excerpt}</p>
        <div className="grow-0 mt-3 md:mt-0 flex flex-col gap-[4px]">
          <StoryMeta story={story} />
          <p className="text-xs">
            <span className="text-white font-bold">{story.chapterCount} </span>
            Chapters
          </p>
          <TagsList tags={story.tags} className="flex gap-2" />
        </div>
      </div>
      {story.wip && (
        <div className="absolute left-4 top-6 md:top-4 badge badge-ghost badge-sm md:badge-md bg-green-700/80 border-0 text-green-300">
          Ongoing story
        </div>
      )}
    </article>
  );
}
