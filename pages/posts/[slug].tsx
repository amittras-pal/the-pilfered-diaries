import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import React from "react";
import {
  getAllPublishedPosts,
  getComments,
  getSinglePost,
} from "../../firebase/server.functions";
import { SinglePostProps } from "../../types/page";
import axios from "axios";
import { CommentDoc, PostDoc } from "../../types/entities";
import grayMatter from "gray-matter";
import {
  dateFormat,
  dateTimeFormat,
  fbTimestampToDateFormat,
} from "../../utils/date.utils";
import readingTime from "reading-time";
import { AVG_WPM, REVAL_TIME } from "../../constants";
import { serialize } from "next-mdx-remote/serialize";
import SinglePostHeader from "../../components/posts/PostHeader";
import { useRouter } from "next/router";
import Markdown from "../../components/markdown/Markdown";
import Divider from "../../components/Divider";
import CommentsList from "../../components/comments/CommentsList";

export default function SinglePost(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const router = useRouter();
  if (router.isFallback) return "Loading..."; // TODO: set up a loader.

  props.content;

  return (
    <>
      <SinglePostHeader metadata={props.metadata} />
      <div id="content" className="my-6 max-w-screen-xl mx-auto px-3 md:px-4">
        <Markdown {...props.content} />
        <Divider direction="horizontal" className="my-3" />
        <CommentsList
          comments={props.comments}
          itemTitle={props.metadata.title}
          itemId={props.metadata.id}
        />
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
  SinglePostProps,
  { slug: string }
> = async (ctx) => {
  const { params } = ctx;
  const postRes = await getSinglePost(params?.slug ?? "");
  const post = postRes.data() as PostDoc;

  if (post.draft)
    return { redirect: { destination: "/content-x", statusCode: 307 } };

  const commentsRes = await getComments("posts", params?.slug ?? "");
  const file = await axios.get(post.content ?? "");
  const { content } = grayMatter(file.data);

  delete post.content;

  const metadata = {
    ...post,
    id: postRes.id,
    published: fbTimestampToDateFormat(post.published, dateFormat),
    readingTime: readingTime(content, { wordsPerMinute: AVG_WPM }),
  };

  delete metadata.content;

  const comments = commentsRes.docs.map((cm) => {
    const cmnt = cm.data() as CommentDoc;
    return {
      ...cmnt,
      date: fbTimestampToDateFormat(cmnt.date, dateTimeFormat),
      id: cm.id,
    };
  });

  return {
    props: {
      content: await serialize(content),
      metadata,
      comments,
      // TODO: Add related posts
    },
    revalidate: REVAL_TIME,
  };
};
