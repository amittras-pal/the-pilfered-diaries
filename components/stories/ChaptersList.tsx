import { IconArrowRight } from "@tabler/icons-react";
import { ChapterWOContent } from "@typeDefs/page";
import Link from "next/link";

export default function ChaptersList({
  chapters,
  slug,
}: {
  slug: string;
  chapters: ChapterWOContent[];
}) {
  return (
    <ul className="my-3 grid grid-cols-1 divide-y divide-gray-700 rounded-md overflow-hidden border border-gray-700">
      <li className="flex flex-col md:flex-row gap-2 items-start md:items-center p-3">
        <Link
          href={`/stories/${slug}/${chapters.at(0)?.id}`}
          className="btn btn-sm w-full justify-between md:w-fit bg-violet-300 text-gray-800 hover:bg-violet-400 focus:bg-violet-400"
        >
          Start Reading Chapter 1 <IconArrowRight size={20} />
        </Link>
        <span>Or jump directly to a chapter from below...</span>
      </li>
      {chapters.map((chapter) => (
        <li key={chapter.id}>
          <Link
            href={`/stories/${slug}/${chapter.id}`}
            className="block p-3 transition-colors hover:bg-gray-600/50 group"
          >
            <h3 className="text-xl text-white group-hover:text-violet-400 transition-colors">
              {chapter.order}. {chapter.title}
            </h3>
            <p className="text-sm ">{chapter.excerpt}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
