import { StoryWOChaptersNContent } from "../../types/page";
import StoryMeta from "../StoryMeta";

export default function StoryHeader({
  metadata,
}: {
  metadata: StoryWOChaptersNContent;
}) {
  return (
    <header
      className="hero bg-base-200 relative h-[75vh] md:h-[50vh] place-content-end"
      style={{ backgroundImage: `url(${metadata.cover})` }}
    >
      <div className="hero-content text-center bg-gray-700/20 backdrop-blur-sm rounded-md shadow-lg">
        <div className="max-w-xl flex flex-col items-center">
          <h1 className="text-5xl font-serif text-white">{metadata.title}</h1>
          <StoryMeta
            story={metadata}
            addTopMargin
            className="text-white text-md font-serif"
          />
          <p className="pt-3 font-thin text-sm text-white">
            {metadata.excerpt}
          </p>
        </div>
      </div>
    </header>
  );
}
