import Divider from "@components/Divider";
import SubscriptionForm from "@components/aside-cta/SubscriptionForm";
import Header from "@components/home/Header";
import Posts from "@components/home/Posts";
import Stories from "@components/home/Stories";
import SubmitContent from "@components/home/SubmitContent";
import { REVAL_TIME } from "@constants/app";
import {
  getPosts,
  getSiteImageCfg,
  getStories,
} from "@firebase/server.functions";
import { PostDoc, SiteImageCfg, StoryDoc } from "@typeDefs/entities";
import { HomeProps } from "@typeDefs/page";
import { isoDateOfTimestamp } from "@utils/app.utils";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import About from "../components/home/About";

export default function Home({
  stories,
  posts,
  headerCfg,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div id="home_page">
      <Header cfg={headerCfg} />
      <section className="max-w-screen-2xl mx-auto py-4 px-3 shadow-md">
        <About image={headerCfg.profileHome} />
      </section>
      <div className="flex flex-col md:flex-row gap-6 md:gap-3 max-w-screen-2xl mx-auto py-4 px-3">
        <section className="basis-3/5 flex flex-col">
          <Stories data={stories} />
        </section>
        <section className="basis-2/5">
          <Posts data={posts} />
        </section>
      </div>
      <Divider
        direction="horizontal"
        className="mt-3 max-w-xs md:max-w-screen-md mx-auto bg-purple-400"
      />
      <div className="bg-gradient-to-b md:bg-gradient-to-r from-transparent via-purple-900 to-transparent">
        <section className="flex flex-col gap-4 max-w-screen-md mx-auto py-4 px-3">
          <SubmitContent />
          <SubscriptionForm btnLeft />
        </section>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async (_ctx) => {
  const [storiesRes, postsRes, imageCfgRes] = await Promise.all([
    getStories(5),
    getPosts("owned", 3),
    getSiteImageCfg(),
  ]);

  const stories = storiesRes.docs.map((doc) => {
    const story = doc.data() as StoryDoc;
    const obj = {
      ...story,
      slug: doc.id,
      published: isoDateOfTimestamp(story.published),
      lastUpdated: isoDateOfTimestamp(story.lastUpdated),
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
      published: isoDateOfTimestamp(post.published),
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
    revalidate: REVAL_TIME,
  };
};
