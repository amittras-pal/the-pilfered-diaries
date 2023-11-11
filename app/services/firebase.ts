import firestore from "../firebase/admin";

export function getStories(limit: number) {
  return firestore
    .collection("stories")
    .where("draft", "==", false)
    .orderBy("lastUpdated", "desc")
    .limit(limit)
    .get();
}

export function getPosts(limit: number, type: string) {
  return type === "all"
    ? firestore
        .collection("posts")
        .where("draft", "==", false)
        .orderBy("published", "desc")
        .limit(limit)
        .get()
    : firestore
        .collection("posts")
        .where("draft", "==", false)
        .where("byGuest", "==", type === "guest")
        .orderBy("published", "desc")
        .limit(limit)
        .get();
}
