import { Timestamp } from "firebase-admin/firestore";

export interface ChapterDoc {
  author: string;
  content?: string;
  excerpt: string;
  id: string;
  order: number;
  previousChapter: string;
  nextChapter: string;
  published: Timestamp;
  title: string;
}

export interface StoryDoc {
  author: string;
  byGuest: boolean;
  chapters?: ChapterDoc[];
  content?: string;
  cover: string;
  draft: boolean;
  excerpt: string;
  id: string;
  lastUpdated: Timestamp;
  published: Timestamp;
  tags: string[];
  title: string;
  wip: boolean;
}

export interface PostDoc {
  author: string;
  byGuest: boolean;
  content?: string;
  cover: string;
  draft: boolean;
  excerpt: string;
  published: Timestamp;
  tags: string[];
  thumbnail: string;
  title: string;
}

export interface CommentDoc {
  approved: boolean;
  body: string;
  date: Timestamp;
  email: string;
  target: string;
  title: string;
  type: string;
  userName: string;
}

export interface Chapter extends Omit<ChapterDoc, "published"> {
  published: string;
}

export interface Story
  extends Omit<StoryDoc, "published" | "lastUpdated" | "chapters" | "content"> {
  published: string;
  lastUpdated: string;
  slug: string;
  content: string;
  chapters?: Chapter[];
  chapterCount?: number;
}

export interface Post extends Omit<PostDoc, "published"> {
  published: string;
  slug: string;
}

export interface Comment extends Omit<CommentDoc, "date"> {
  date: string;
  id: string;
}

export interface SiteImageCfg {
  headerImg: string;
  profileAbout: string;
  profileHome: string;
  siteHeader: {
    credit: string;
    position: string; // TODO: this isn't used anywhere yet.
    url: string;
  };
}
