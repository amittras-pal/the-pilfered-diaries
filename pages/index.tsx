import {
  getPosts,
  getSiteImageCfg,
  getStories,
} from "@/firebase/server.functions";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import Header from "../components/home/Header";
import { PostDoc, SiteImageCfg, StoryDoc } from "../types/entities";
import { HomePageProps } from "../types/page";
import { dateFormat, fbTimestampToDateFormat } from "../utils/date.utils";
import Stories from "../components/home/Stories";
import { REVALIDATION_TIME } from "../constants";
import Posts from "../components/home/Posts";
import SubmitContent from "../components/home/SubmitContent";

export default function Home({
  stories,
  posts,
  headerCfg,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div id="home_page">
      <Header cfg={headerCfg} />
      <div className="flex flex-col md:flex-row gap-2 md:gap-3 max-w-screen-2xl mx-auto py-4 px-2 md:px-3">
        <section className="basis-3/5 flex flex-col">
          <Stories data={stories} />
          <SubmitContent />
        </section>
        <section className="basis-2/5">
          <Posts data={posts} />
        </section>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps<HomePageProps> = async (_ctx) => {
  const [storiesRes, postsRes, imageCfgRes] = await Promise.all([
    getStories(5),
    getPosts("owned", 5),
    getSiteImageCfg(),
  ]);

  const stories = storiesRes.docs.map((doc) => {
    const story = doc.data() as StoryDoc;
    const obj = {
      ...story,
      slug: doc.id,
      published: fbTimestampToDateFormat(story.published, dateFormat),
      lastUpdated: fbTimestampToDateFormat(story.lastUpdated, dateFormat),
      chapterCount: story.chapters?.length,
    };

    delete obj.chapters;
    delete obj.content;
    return obj;
  });

  const posts = postsRes.docs.map((doc) => {
    const post = doc.data() as PostDoc;
    const obj = {
      ...post,
      slug: doc.id,
      published: fbTimestampToDateFormat(post.published, dateFormat),
    };

    delete obj.content;
    return obj;
  });

  return {
    props: {
      stories,
      posts,
      headerCfg: imageCfgRes.data() as SiteImageCfg,
    },
    revalidate: REVALIDATION_TIME,
  };
};
