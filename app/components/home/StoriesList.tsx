import React from "react";
import { StoryDoc } from "../../types/entities";
import Image from "next/image";
import { DATE_FORMATS, DISPLAY_TAGS } from "../../constants";
import Link from "next/link";
import dayjs from "dayjs";
import {
  IconChevronLeft,
  IconChevronRight,
  IconPoint,
} from "@tabler/icons-react";

interface IStoriesListProps {
  data: StoryDoc[];
}

export default function StoriesList(props: IStoriesListProps) {
  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl md:text-2xl font-serif mb-2 md:mb-3 text-violet-300">
          Stories & Narratives
        </h3>
        <Link href="/stories" className="btn btn-ghost btn-sm">
          View All
        </Link>
      </div>
      <div className="carousel rounded-tr-box rounded-tl-box w-full">
        {props.data.map((story, i, { length }) => (
          <article
            className="carousel-item w-11/12 mr-2.5 md:mr-4 relative"
            id={`story-slide-${i}`}
            key={story.slug}
          >
            <div className="card mb-2 md:mb-3 last:mb-0">
              <figure className="rounded-br-box rounded-bl-box border border-gray-600">
                <Image
                  src={story.cover}
                  width={1280}
                  height={720}
                  alt="Shoes"
                />
              </figure>
              <div className="card-body gap-1 md:gap-2 py-3 px-1.5">
                <Link
                  href={`/stories/${story.slug}`}
                  className="card-title font-serif transition-all flex-grow-0 text-white hover:text-violet-300"
                >
                  {story.title}
                </Link>
                <div className="line-clamp-2 font-serif">{story.excerpt}</div>
                <p className="text-xs flex gap-1/2 items-center mt-auto">
                  {dayjs(story.published).format(DATE_FORMATS.date)}
                  <IconPoint size={8} style={{ margin: "0px 4px" }} />
                  {story.author}
                  <IconPoint size={8} style={{ margin: "0px 4px" }} />
                  {story.chapterCount} Chapters
                </p>
                {story.wip && (story.chapterCount ?? 0) > 1 && (
                  <p className="text-xs text-green-300 mb-1">
                    Updated:{" "}
                    {dayjs(story.lastUpdated).format(DATE_FORMATS.date)}
                  </p>
                )}

                <div className="card-actions justify-start items-center">
                  {story.tags.slice(0, DISPLAY_TAGS).map((tag) => (
                    <div
                      key={tag}
                      className="badge bg-violet-800 text-violet-100 text-xs"
                    >
                      {tag}
                    </div>
                  ))}
                  {story.tags.length > DISPLAY_TAGS && (
                    <div
                      className="tooltip mb-1"
                      data-tip={story.tags.slice(DISPLAY_TAGS).join(", ")}
                    >
                      <div className="badge bg-violet-800 text-violet-100 text-xs">
                        +{story.tags.length - DISPLAY_TAGS}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="absolute hidden md:flex transform -translate-y-1/2 left-2 right-2 top-1/2">
              {i > 0 && (
                <a
                  href={`#story-slide-${i - 1}`}
                  className="btn btn-circle bg-violet-700 hover:bg-violet-500 btn-sm shadow-md border-0"
                >
                  <IconChevronLeft size={16} />
                </a>
              )}
              {i < length - 1 && (
                <a
                  href={`#story-slide-${i + 1}`}
                  className="btn btn-circle bg-violet-700 hover:bg-violet-500 btn-sm shadow-md border-0 ml-auto"
                >
                  <IconChevronRight size={16} />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
