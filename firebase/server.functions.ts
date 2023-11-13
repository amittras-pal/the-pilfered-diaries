import firestore from "@/firebase/server.config";

export function getStories(limit: number) {
  return firestore
    .collection("stories")
    .where("draft", "==", false)
    .orderBy("lastUpdated", "desc")
    .limit(limit)
    .get();
}

export function getPosts(type: "guest" | "owned" | "all", limit: number) {
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

export function getSiteImageCfg() {
  return firestore.doc("siteContent/site-config").get();
}

export function getAllPublishedPosts() {
  return firestore.collection("posts").where("draft", "==", false).get();
}

export function getAllPublishedStories() {
  return firestore.collection("stories").where("draft", "==", false).get();
}

export function getSinglePost(slug: string) {
  return firestore.doc("posts/" + slug).get();
}

export function getSingleStory(slug: string) {
  return firestore.doc("stories/" + slug).get();
}

export function getComments(
  contentType: "stories" | "posts",
  contentId: string
) {
  return firestore
    .collection("comments")
    .where("type", "==", contentType)
    .where("target", "==", contentId)
    .where("approved", "==", true)
    .orderBy("date", "desc")
    .get();
}
