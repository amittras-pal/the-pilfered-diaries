import { dateFormat } from "@constants/app";
import { IconLine, IconPoint } from "@tabler/icons-react";
import { SingleChapterProps } from "@typeDefs/page";
import { getReadingTime } from "@utils/app.utils";
import dayjs from "dayjs";

export default function ChapterHeader({
  chapter,
  story,
  readTime,
}: Omit<SingleChapterProps, "content" | "comments">) {
  return (
    <header
      className="hero bg-base-200 relative h-[75vh] md:h-[50vh] place-content-end"
      style={{ backgroundImage: `url(${story.cover})` }}
    >
      <div className="hero-content text-center bg-gray-700/20 backdrop-blur-sm rounded-md shadow-lg">
        <div className="max-w-xl flex flex-col items-center">
          <h1 className="text-5xl text-white mb-3">{chapter.title}</h1>
          <p className="flex gap-1 items-center justify-center text-gray-300 ">
            <span>{story.title}</span>
            <IconLine size={16} />
            <span>Chapter {chapter.order}</span>
          </p>
          <div className="border-t border-gray-500 my-1 w-full"></div>
          <p className="flex gap-1 items-center justify-center text-gray-300 text-sm">
            <span>{chapter.author}</span>
            <IconPoint size={16} />
            <span>{getReadingTime(readTime)}</span>
            <IconPoint size={16} />
            <span suppressHydrationWarning>
              {dayjs(chapter.published).format(dateFormat)}
            </span>
          </p>

          <p className="mt-3 font-thin text-sm text-gray-300">
            {chapter.excerpt}
          </p>
        </div>
      </div>
    </header>
  );
}
