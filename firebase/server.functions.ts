import admin from "./server.config";

// List of published stories.
export function getStories(limit: number) {
  return admin
    .firestore()
    .collection("stories")
    .where("draft", "==", false)
    .orderBy("lastUpdated", "desc")
    .limit(limit)
    .get();
}

// List of published posts.
export function getPosts(type: "guest" | "owned" | "all", limit: number) {
  return type === "all"
    ? admin
        .firestore()
        .collection("posts")
        .where("draft", "==", false)
        .orderBy("published", "desc")
        .limit(limit)
        .get()
    : admin
        .firestore()
        .collection("posts")
        .where("draft", "==", false)
        .where("byGuest", "==", type === "guest")
        .orderBy("published", "desc")
        .limit(limit)
        .get();
}

// Site Header/Images configuration.
export function getSiteImageCfg() {
  return admin.firestore().doc("siteContent/site-config").get();
}

// Used for paths list via getStaticPaths in the respective dynamic routes.
export function getAllPublishedPosts() {
  return admin
    .firestore()
    .collection("posts")
    .where("draft", "==", false)
    .get();
}

// Used for paths list via getStaticPaths in the respective dynamic routes.
export function getAllPublishedStories() {
  return admin
    .firestore()
    .collection("stories")
    .where("draft", "==", false)
    .get();
}

// Used for data via getStaticProps in the respective dynamic routes.
export function getSinglePost(slug: string) {
  return admin
    .firestore()
    .doc("posts/" + slug)
    .get();
}

// Used for data via getStaticProps in the respective dynamic routes.
export function getSingleStory(slug: string) {
  return admin
    .firestore()
    .doc("stories/" + slug)
    .get();
}

// Get comments for a specific post/story
export function getComments(
  contentType: "stories" | "posts",
  contentId: string
) {
  return admin
    .firestore()
    .collection("comments")
    .where("type", "==", contentType)
    .where("target", "==", contentId)
    .where("approved", "==", true)
    .orderBy("date", "desc")
    .get();
}
