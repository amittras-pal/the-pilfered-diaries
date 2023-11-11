import { Timestamp } from "firebase-admin/firestore";

// Coming from firebase
export interface ChapterRecord {
  nextChapter: string;
  author: string;
  previousChapter: string;
  id: string;
  published: Timestamp;
  excerpt: string;
  title: string;
  content: string;
  order: number;
}

// Coming from firebase
export interface StoryRecord {
  author: string;
  excerpt: string;
  title: string;
  tags: string[];
  published: Timestamp;
  byGuest: boolean;
  draft: boolean;
  content?: string;
  wip: boolean;
  lastUpdated: Timestamp;
  cover: string;
  // TODO: fix this.
  chapters?: ChapterRecord[];
}

// Used by App
export interface ChapterDoc {
  nextChapter: string;
  author: string;
  previousChapter: string;
  id: string;
  published: string;
  excerpt: string;
  title: string;
  content: string;
  order: number;
}

// Used by App
export interface StoryDoc {
  author: string;
  excerpt: string;
  title: string;
  tags: string[];
  published: string;
  byGuest: boolean;
  draft: boolean;
  content: string;
  wip: boolean;
  lastUpdated: string;
  cover: string;
  slug?: string;
  // TODO: fix this.
  chapters?: ChapterDoc[];
  chapterCount?: number;
}

export interface SiteImageConfig {
  profileHome: string;
  profileAbout: string;
  headerImg: string;
  siteHeader: {
    url: string;
    credit: string;
    position: string;
  };
}
