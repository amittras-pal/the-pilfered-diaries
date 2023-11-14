import { IconPoint } from "@tabler/icons-react";
import { Story } from "@typeDefs/entities";
import { StoryWOChaptersNContent } from "@typeDefs/page";
import dayjs from "dayjs";
import { dateFormat } from "@utils/date.utils";

interface StoryMetaProps {
  story: Story | StoryWOChaptersNContent;
  className?: string;
}

export default function StoryMeta(props: StoryMetaProps) {
  return (
    <p
      suppressHydrationWarning
      className={`flex items-center text-xs ${props.className ?? ""}`}
    >
      {props.story.author}
      <IconPoint size={8} style={{ margin: "0px 2px" }} />
      {dayjs(props.story.published).format(dateFormat)}
      <IconPoint size={8} style={{ margin: "0px 2px" }} />
      {props.story.chapterCount} Chapters
      {props.story.wip && (props.story.chapterCount ?? 0) > 1 && (
        <>
          <IconPoint size={8} style={{ margin: "0px 2px" }} />
          <span className="text-green-400">
            Updated: {dayjs(props.story.lastUpdated).format(dateFormat)}
          </span>
        </>
      )}
    </p>
  );
}
