import { SITE_TITLE } from "@constants/app";
import { Story } from "@typeDefs/entities";
import {
  ChapterWOContent,
  SinglePostMetadata,
  StoryWOChaptersNContent,
} from "@typeDefs/page";
import { Timestamp } from "firebase-admin/firestore";
import { ReadTimeResults } from "reading-time";

export function baseUrl(path: string): string {
  return process.env.NEXT_PUBLIC_SITE_URL + path;
}

export const numCompacter = Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function getReadingTime(readTime: ReadTimeResults): string {
  const time = readTime.text.split(" ").slice(0, 2).join(" ");
  const words = numCompacter.format(readTime.words);

  return `${time} (${words} words)`;
}

export function generatePostTitle(post: SinglePostMetadata) {
  return post.title + " | " + SITE_TITLE;
}

export function generateStoryTitle(story: StoryWOChaptersNContent) {
  return story.title + " | " + SITE_TITLE;
}

export function generateChapterTitle(
  chapter: ChapterWOContent,
  story: Pick<Story, "title" | "cover" | "slug" | "tags">
) {
  return `${chapter.title} [${story.title}: Chapter ${chapter.order}] | ${SITE_TITLE}`;
}

export function isoDateOfTimestamp(timestamp: Timestamp) {
  return timestamp.toDate().toISOString();
}
