import { IconPoint } from "@tabler/icons-react";
import { SinglePostMetadata } from "@typeDefs/page";
import { getReadingTime } from "@utils/app.utils";

export default function SinglePostHeader({
  metadata,
}: {
  metadata: SinglePostMetadata;
}) {
  return (
    <header
      className="hero bg-base-200 relative h-[75vh] md:h-[50vh] place-content-end"
      style={{ backgroundImage: `url(${metadata.cover})` }}
    >
      <div className="hero-content text-center bg-gray-700/20 backdrop-blur-sm rounded-md shadow-lg">
        <div className="max-w-screen-xl">
          <h1 className="text-5xl font-serif text-white">{metadata.title}</h1>
          <p className="my-3 flex gap-1 items-center justify-center text-white font-serif text-sm">
            <span>{metadata.author}</span>
            <IconPoint size={16} />
            <span>{getReadingTime(metadata.readingTime)}</span>
            <IconPoint size={16} />
            <span>{metadata.published}</span>
          </p>
          <p className="text-sm font-serif text-violet-200">
            {metadata.excerpt}
          </p>
        </div>
      </div>
    </header>
  );
}
