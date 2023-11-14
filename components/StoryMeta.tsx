import { IconPoint } from "@tabler/icons-react";
import { Story } from "@typeDefs/entities";
import { StoryWOChaptersNContent } from "@typeDefs/page";

interface StoryMetaProps {
  story: Story | StoryWOChaptersNContent;
  className?: string;
}

export default function StoryMeta(props: StoryMetaProps) {
  return (
    <p className={`flex items-center text-xs ${props.className ?? ""}`}>
      {props.story.author}
      <IconPoint size={8} style={{ margin: "0px 2px" }} />
      {props.story.published}
      <IconPoint size={8} style={{ margin: "0px 2px" }} />
      {props.story.chapterCount} Chapters
      {props.story.wip && (props.story.chapterCount ?? 0) > 1 && (
        <>
          <IconPoint size={8} style={{ margin: "0px 2px" }} />
          <span className="text-green-400">
            Updated: {props.story.lastUpdated}
          </span>
        </>
      )}
    </p>
  );
}
