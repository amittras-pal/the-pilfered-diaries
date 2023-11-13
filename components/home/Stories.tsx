import StoryMeta from "@components/StoryMeta";
import TagsList from "@components/TagsList";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { StoryWOChaptersNContent } from "@typeDefs/page";
import Image from "next/image";
import Link from "next/link";

interface StoriesProps {
  data: StoryWOChaptersNContent[];
}

export default function Stories({ data }: StoriesProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-2xl text-violet-300 font-serif">
          Stories & Narratives
        </h2>
        <Link href="/stories" className="btn btn-sm btn-ghost">
          View All
        </Link>
      </div>
      <div className="carousel w-full">
        {data.map((story, i, { length }) => (
          <article
            id={`slide-${i}`}
            className="carousel-item flex-col relative w-11/12 md:w-full mr-2 md:mr-0"
            key={story.slug}
          >
            <Link href={`/stories/${story.slug}`}>
              <Image
                width={1280}
                height={720}
                src={story.cover}
                alt={story.slug + "-cover"}
                className="w-full rounded-box transition-transform transform hover:scale-[99%]"
              />
            </Link>
            <Link
              href={`/stories/${story.slug}`}
              className="text-2xl mt-3 text-white hover:text-violet-400 focus:text-violet-400 outline-none transition-colors font-serif whitespace-nowrap"
            >
              {story.title}
            </Link>
            <p className="text-sm">{story.excerpt}</p>
            <StoryMeta story={story} addTopMargin />
            <TagsList tags={story.tags} className="flex mt-3 gap-2" />
            <div className="hidden md:flex absolute justify-end gap-3 top-4 right-4">
              {i > 0 && (
                <a
                  href={`#slide-${i - 1}`}
                  className="btn btn-circle shadow-md bg-violet-200/50 hover:bg-violet-200 text-black border-0"
                >
                  <IconChevronLeft size={24} />
                </a>
              )}
              {i < length - 1 && (
                <a
                  href={`#slide-${i + 1}`}
                  className="btn btn-circle shadow-md bg-violet-200/50 hover:bg-violet-200 text-black border-0"
                >
                  <IconChevronRight size={24} />
                </a>
              )}
            </div>
            {story.wip && (
              <div className="absolute left-2 md:left-4 top-2 md:top-4 badge badge-ghost badge-sm md:badge-md bg-green-700/80 border-0 text-green-300">
                Ongoing story
              </div>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
