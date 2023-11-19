import Divider from "@components/Divider";
import SubmitOrDonateAside from "@components/aside-cta/AsideCTA";
import Share from "@components/client/Share";
import CommentsList from "@components/comments/CommentsList";
import Markdown from "@components/markdown/Markdown";
import SinglePostHeader from "@components/posts/PostHeader";
import { AVG_WPM, REVAL_TIME, SITE_URL } from "@constants/app";
import {
  getAllPublishedPosts,
  getComments,
  getSinglePost,
} from "@firebase/server.functions";
import { CommentDoc, PostDoc } from "@typeDefs/entities";
import { SinglePostProps } from "@typeDefs/page";
import { generatePostTitle, isoDateOfTimestamp } from "@utils/app.utils";
import axios from "axios";
import grayMatter from "gray-matter";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { serialize } from "next-mdx-remote/serialize";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import readingTime from "reading-time";

export default function SinglePost(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const router = useRouter();
  // TODO: set up a loader.
  // TODO: also set up loader for other ISR pages.
  if (router.isFallback) return "Loading...";

  return (
    <>
      <NextSeo
        title={generatePostTitle(props.metadata)}
        description={props.metadata.excerpt}
        openGraph={{
          type: "article",
          description: props.metadata.excerpt,
          title: props.metadata.title,
          url: SITE_URL + "/posts/" + props.metadata.id,
          article: {
            publishedTime: props.metadata.published,
            tags: props.metadata.tags,
            authors: [props.metadata.author],
          },
          images: [
            {
              url: props.metadata.cover,
              width: 1280,
              height: 720,
              alt: props.metadata.id + "-cover",
            },
          ],
        }}
      />
      <SinglePostHeader metadata={props.metadata} />
      <div
        id="content"
        className="my-6 max-w-screen-xl mx-auto px-3 md:px-4 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-violet-300"
      >
        <div className="basis-9/12 px-0 md:px-2">
          <Markdown {...props.content} />
          <Divider direction="horizontal" className="my-3" />
          <Share contentTitle={props.metadata.title} contentType="Post" />
          <Divider direction="horizontal" className="my-3" />
          <CommentsList
            comments={props.comments}
            itemTitle={props.metadata.title}
            itemId={props.metadata.id}
            itemType="posts"
          />
        </div>
        <SubmitOrDonateAside />
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
    published: isoDateOfTimestamp(post.published),
    readingTime: readingTime(content, { wordsPerMinute: AVG_WPM }),
  };

  delete metadata.content;

  const comments = commentsRes.docs.map((cm) => {
    const cmnt = cm.data() as CommentDoc;
    return {
      ...cmnt,
      date: isoDateOfTimestamp(cmnt.date),
      id: cm.id,
    };
  });

  return {
    props: {
      content: await serialize(content),
      metadata,
      comments,
      // TODO: Add related posts
      // TODO: also add related content for other content types.
    },
    revalidate: REVAL_TIME,
  };
};
