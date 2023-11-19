import firestore from "@firebase/server.config";
import { GetServerSideProps } from "next";
import { SITE_URL } from "../constants/app";
import { PostDoc, StoryDoc } from "../types/entities";

export default function Sitemap() {}

export const getServerSideProps: GetServerSideProps<{}> = async (ctx) => {
  const [storiesRes, postsRes] = await Promise.all([
    getAllStories(),
    getAllPosts(),
  ]);

  const posts: SitemapFields[] = postsRes.docs.map((p) => {
    const post = p.data() as PostDoc;
    return {
      loc: `${SITE_URL}/posts/${p.id}`,
      lastmod: post.published.toDate().toISOString(),
    };
  });

  const chapters: SitemapFields[] = [];

  const stories: SitemapFields[] = storiesRes.docs.map((s) => {
    const story = s.data() as StoryDoc;
    story.chapters?.forEach((c) => {
      chapters.push({
        loc: `${SITE_URL}/stories/${s.id}/${c.id}`,
        lastmod: c.published.toDate().toISOString(),
      });
    });
    return {
      loc: `${SITE_URL}/stories/${s.id}`,
      lastmod: story.lastUpdated.toDate().toISOString(),
    };
  });

  ctx.res.setHeader("Content-Type", "text/xml");
  const xml = generateSitemapXML([...posts, ...stories, ...chapters]);
  ctx.res.write(xml);
  ctx.res.end();

  return { props: {} };
};

function getAllStories() {
  return firestore
    .collection("stories")
    .where("draft", "==", false)
    .orderBy("lastUpdated", "desc")
    .get();
}

function getAllPosts() {
  return firestore
    .collection("posts")
    .where("draft", "==", false)
    .orderBy("published", "desc")
    .get();
}

interface SitemapFields {
  loc: string;
  lastmod: string;
}

function generateSitemapXML(pages: SitemapFields[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(
    (page) => `<url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
  </url>`
  )}
  </urlset>`;
}
