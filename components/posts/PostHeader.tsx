import { IconPoint } from "@tabler/icons-react";
import { SinglePostMetadata } from "@typeDefs/page";
import { getReadingTime } from "@utils/app.utils";
import dayjs from "dayjs";
import { dateFormat } from "../../constants/app";

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
          <h1 className="text-5xl text-white">{metadata.title}</h1>
          <p className="my-3 flex gap-1 items-center justify-center text-white text-sm">
            <span>{metadata.author}</span>
            <IconPoint size={16} />
            <span>{getReadingTime(metadata.readingTime)}</span>
            <IconPoint size={16} />
            <span suppressHydrationWarning>
              {dayjs(metadata.published).format(dateFormat)}
            </span>
          </p>
          <p className="text-sm text-violet-200">{metadata.excerpt}</p>
        </div>
      </div>
    </header>
  );
}
