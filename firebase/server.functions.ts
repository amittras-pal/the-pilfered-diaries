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

export function getSinglePost(slug: string) {
  return firestore.doc("posts/" + slug).get();
}
