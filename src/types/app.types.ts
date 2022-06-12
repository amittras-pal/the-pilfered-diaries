import { User } from "firebase/auth";

export type AuthContextProps = {
  currentUser: User | null;
};

export type AuthContextProviderProps = {
  children: JSX.Element;
};

export type RouteGuardProps = {
  children: JSX.Element;
};

export type StoryDetails = {
  title: string;
  excerpt: string;
  numberOfChapters: number;
  isPaid: boolean;
  coverUrl: string;
  chapterList: string[];
  price?: number;
};
