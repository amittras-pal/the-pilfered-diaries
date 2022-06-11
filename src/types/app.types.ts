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
