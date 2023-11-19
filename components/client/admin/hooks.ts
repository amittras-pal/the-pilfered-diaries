import { firestore } from "@firebase/client.config";
import { Comment, CommentDoc, StoryDoc } from "@typeDefs/entities";
import dayjs from "dayjs";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { dateTimeFormat } from "../../../constants/app";

export function useCommentsList() {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const q = query(
      collection(firestore, "comments"),
      where("approved", "==", false),
      orderBy("date", "desc")
    );
    return onSnapshot(q, (s) => {
      const documents = s.docs.map((doc) => {
        const com = doc.data() as CommentDoc;
        return {
          ...com,
          id: doc.id,
          date: dayjs(com.date.toDate()).format(dateTimeFormat),
        };
      });
      setComments(documents);
    });
  }, []);

  return comments;
}

export function useWIPStories() {
  const [stories, setStories] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(firestore, "stories"), where("wip", "==", true));
    return onSnapshot(q, (s) => {
      const stories = s.docs.map((doc) => {
        const story = doc.data() as StoryDoc;
        return {
          ...story,
          slug: doc.id,
        };
      });
      setStories(stories);
    });
  }, []);

  return stories;
}
