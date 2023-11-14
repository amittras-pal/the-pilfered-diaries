import { IconPoint } from "@tabler/icons-react";
import { Post } from "@typeDefs/entities";
import { PostWOContent } from "@typeDefs/page";
import { dateFormat } from "@utils/date.utils";
import dayjs from "dayjs";

interface StoryMetaProps {
  post: Post | PostWOContent;
  className?: string;
}

export default function PostMeta(props: StoryMetaProps) {
  return (
    <p
      suppressHydrationWarning
      className={`flex items-center text-xs ${props.className ?? ""}`}
    >
      {props.post.author}
      <IconPoint size={8} style={{ margin: "0px 4px" }} />
      {dayjs(props.post.published).format(dateFormat)}
      {/* <IconPoint size={8} style={{ margin: "0px 4px" }} /> */}
      {/* {props.} Chapters
      {props. && (props. ?? 0) > 1 && (
        <>
          <IconPoint size={8} style={{ margin: "0px 4px" }} />
          <span className="text-green-400">
            Updated: {props.}
          </span>
        </>
      )} */}
    </p>
  );
}
