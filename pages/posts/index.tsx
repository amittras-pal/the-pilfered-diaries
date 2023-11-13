import SubmitOrDonateAside from "@components/SubmitOrDonateAside";
import Post from "@components/posts/Post";
import { REVAL_TIME, SITE_TITLE } from "@constants/app";
import { getPosts } from "@firebase/server.functions";
import { PostDoc } from "@typeDefs/entities";
import { PostsListProps } from "@typeDefs/page";
import { dateFormat, fbTimestampToDateFormat } from "@utils/date.utils";
import { GetStaticProps, InferGetStaticPropsType } from "next";

export default function PostsList({
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <div className="max-w-screen-2xl mx-auto pt-4 px-4 md:px-6">
        <h1 className="text-3xl font-serif text-violet-300">
          Stories & Narratives on {SITE_TITLE}...
        </h1>
      </div>
      <div className="flex flex-col md:flex-row pt-4 md:pt-6 max-w-screen-2xl mx-auto divide-y md:divide-y-0 md:divide-x divide-violet-300">
        <div className="basis-9/12 px-2 md:px-4">
          {posts.map((post) => (
            <Post {...post} key={post.slug} />
          ))}
        </div>
        <SubmitOrDonateAside />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<PostsListProps> = async (_ctx) => {
  const response = await getPosts("all", 25);
  const posts = response.docs.map((doc) => {
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
    props: { posts },
    revalidate: REVAL_TIME,
  };
};
