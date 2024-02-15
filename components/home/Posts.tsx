import PostMeta from "@components/PostMeta";
import TagsList from "@components/TagsList";
import { PostWOContent } from "@typeDefs/page";
import Image from "next/image";
import Link from "next/link";

interface StoriesProps {
  data: PostWOContent[];
}

export default function Posts({ data }: StoriesProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-2xl text-violet-300 ">Single Posts</h2>
        <Link href="/posts" className="btn btn-sm btn-ghost">
          View All
        </Link>
      </div>
      {data.map((post) => (
        <article
          className="flex rounded-xl overflow-hidden mb-2 md:mb-3 border border-gray-700 last:mb-0"
          key={post.slug}
        >
          <figure className="basis-1/3 bg-violet-300/30">
            <Link href={`/posts/${post.slug}`}>
              <Image
                src={post.thumbnail}
                width={240}
                height={240}
                alt={post.slug + "-cover"}
                className="w-full transition-transform transform hover:scale-[95%] hover:rounded-lg"
              />
            </Link>
          </figure>
          <div className="p-2 md:p-3 basis-2/3 flex flex-col">
            <Link
              href={`/posts/${post.slug}`}
              className="text-xl text-white hover:text-violet-400 focus:text-violet-400 outline-none transition-colors whitespace-nowrap font-display"
            >
              {post.title}
            </Link>
            <p className="text-xs line-clamp-1 md:line-clamp-2">
              {post.excerpt}
            </p>
            <PostMeta post={post} className="mt-auto" />
            <TagsList tags={post.tags} className="" showCount={2} />
          </div>
        </article>
      ))}
    </>
  );
}
