import { ReadTimeResults } from "reading-time";
import { Chapter, Comment, Post, SiteImageCfg, Story } from "./entities";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

// Some Global items
export type MarkdownContent = MDXRemoteSerializeResult<
  Record<string, unknown>,
  Record<string, unknown>
>;

export type StoryWOChaptersNContent = Omit<Story, "chapters" | "content">;
export type StoryWOContent = Omit<Story, "chapters">;
export type ChapterWOContent = Omit<Chapter, "content">;
export type PostWOContent = Omit<Post, "contnet">;

export interface HomeProps {
  stories: StoryWOChaptersNContent[];
  posts: PostWOContent[];
  headerCfg: SiteImageCfg;
}

export interface StoriesListProps {
  stories: StoryWOChaptersNContent[];
}

export interface PostsListProps {
  posts: PostWOContent[];
}

export interface SinglePostMetadata extends Omit<Post, "content" | "slug"> {
  readingTime: ReadTimeResults;
  id: string;
}
export interface SinglePostProps {
  content: MarkdownContent;
  metadata: SinglePostMetadata;
  comments: Comment[];
}

export interface SingleStoryProps {
  preface: MarkdownContent;
  metadata: StoryWOChaptersNContent;
  chapters: ChapterWOContent[];
  comments: Comment[];
}

export interface SingleChapterProps {
  chapter: ChapterWOContent;
  story: Pick<Story, "title" | "cover" | "slug">;
  content: MarkdownContent;
  readTime: ReadTimeResults;
  comments: Comment[];
}
