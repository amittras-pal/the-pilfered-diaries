import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import React from "react";
import {
  getAllPublishedPosts,
  getSinglePost,
} from "../../firebase/server.functions";
import { SinglePostPageProps } from "../../types/page";
import axios from "axios";
import { PostDoc } from "../../types/entities";
import grayMatter from "gray-matter";
import { dateFormat, fbTimestampToDateFormat } from "../../utils/date.utils";
import readingTime from "reading-time";
import { AVG_WPM, REVALIDATION_TIME } from "../../constants";
import { serialize } from "next-mdx-remote/serialize";
import SinglePostHeader from "../../components/posts/SinglePostHeader";
import { useRouter } from "next/router";
import Markdown from "../../components/markdown/Markdown";

export default function SinglePost(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const router = useRouter();
  if (router.isFallback) return "Loading..."; // TODO: set up a loader.

  props.content;

  return (
    <>
      <SinglePostHeader metadata={props.metadata} />
      <div id="content" className="my-6 max-w-screen-xl mx-auto">
        <Markdown source={props.content.compiledSource} />
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await getAllPublishedPosts();
  const paths = response.docs.map((doc) => ({ params: { slug: doc.id } }));
  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<
  SinglePostPageProps,
  { slug: string }
> = async (ctx) => {
  const { params } = ctx;
  const postRes = await getSinglePost(params?.slug ?? "");
  const post = postRes.data() as PostDoc;

  const file = await axios.get(post.content ?? "");
  const { content } = grayMatter(file.data);

  const meta = {
    ...post,
    published: fbTimestampToDateFormat(post.published, dateFormat),
    readingTime: readingTime(content, { wordsPerMinute: AVG_WPM }),
  };

  delete meta.content;

  return {
    props: {
      content: await serialize(content),
      metadata: meta,
      // TODO: Add comments
      // TODO: Add related posts
    },
    revalidate: REVALIDATION_TIME,
  };
};
