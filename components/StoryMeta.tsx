import React from "react";
import { Story } from "../types/entities";
import { IconPoint } from "@tabler/icons-react";
import { StoryWOChaptersNContent } from "../types/page";

interface StoryMetaProps {
  story: Story | StoryWOChaptersNContent;
  addTopMargin: boolean;
  className?: string;
}

export default function StoryMeta(props: StoryMetaProps) {
  return (
    <p
      className={`flex items-center text-xs ${props.className ?? ""} ${
        props.addTopMargin ? "mt-3" : ""
      }`}
    >
      {props.story.author}
      <IconPoint size={8} style={{ margin: "0px 4px" }} />
      {props.story.published}
      <IconPoint size={8} style={{ margin: "0px 4px" }} />
      {props.story.chapterCount} Chapters
      {props.story.wip && (props.story.chapterCount ?? 0) > 1 && (
        <>
          <IconPoint size={8} style={{ margin: "0px 4px" }} />
          <span className="text-green-400">
            Updated: {props.story.lastUpdated}
          </span>
        </>
      )}
    </p>
  );
}
