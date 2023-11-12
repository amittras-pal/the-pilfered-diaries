import { ReadTimeResults } from "reading-time";
import { Post, SiteImageCfg, Story } from "./entities";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

export type StoryWOChaptersNContent = Omit<Story, "chapters" | "content">;
export type PostWOContent = Omit<Post, "contnet">;

export interface HomePageProps {
  stories: StoryWOChaptersNContent[];
  posts: PostWOContent[];
  headerCfg: SiteImageCfg;
}

export interface StoriesPageProps {
  stories: StoryWOChaptersNContent[];
}

export interface PostsPageProps {
  posts: PostWOContent[];
}

export type SinglePostContent = MDXRemoteSerializeResult<
  Record<string, unknown>,
  Record<string, unknown>
>;
export interface SinglePostMetaData {
  published: string;
  readingTime: ReadTimeResults;
  author: string;
  byGuest: boolean;
  content?: string | undefined;
  cover: string;
  draft: boolean;
  excerpt: string;
  tags: string[];
  thumbnail: string;
  title: string;
}
export interface SinglePostPageProps {
  content: SinglePostContent;
  metadata: SinglePostMetaData;
}
