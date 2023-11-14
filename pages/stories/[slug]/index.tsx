import Divider from "@components/Divider";
import SubmitOrDonateAside from "@components/aside-cta/AsideCTA";
import Share from "@components/client/Share";
import CommentsList from "@components/comments/CommentsList";
import Markdown from "@components/markdown/Markdown";
import ChaptersList from "@components/stories/ChaptersList";
import StoryHeader from "@components/stories/StoryHeader";
import { REVAL_TIME, SITE_URL } from "@constants/app";
import {
  getAllPublishedStories,
  getComments,
  getSingleStory,
} from "@firebase/server.functions";
import { CommentDoc, StoryDoc } from "@typeDefs/entities";
import { SingleStoryProps } from "@typeDefs/page";
import { generateStoryTitle, isoDateOfTimestamp } from "@utils/app.utils";
import axios from "axios";
import grayMatter from "gray-matter";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { serialize } from "next-mdx-remote/serialize";
import { NextSeo } from "next-seo";

export default function SingleStory(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  return (
    <>
      <NextSeo
        title={generateStoryTitle(props.metadata)}
        description={props.metadata.excerpt}
        openGraph={{
          type: "article",
          description: props.metadata.excerpt,
          title: props.metadata.title,
          url: SITE_URL + "/posts/" + props.metadata.id,
          article: {
            publishedTime: props.metadata.published,
            modifiedTime: props.metadata.lastUpdated,
            tags: props.metadata.tags,
            authors: [props.metadata.author],
          },
          images: [
            {
              url: props.metadata.cover,
              width: 1280,
              height: 720,
              alt: props.metadata.slug + "-cover",
            },
          ],
        }}
      />
      <StoryHeader metadata={props.metadata} />
      <div
        id="content"
        className="my-6 max-w-screen-xl mx-auto px-3 md:px-4 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-violet-300"
      >
        <div className="basis-9/12 px-0 md:px-2">
          <h2 className="text-2xl text-violet-300 ">Preface</h2>
          <Markdown {...props.preface} />
          <Divider direction="horizontal" className="my-3" />
          <ChaptersList chapters={props.chapters} slug={props.metadata.slug} />
          <Divider direction="horizontal" className="my-3" />
          <Share contentTitle={props.metadata.title} contentType="Story" />
          <Divider direction="horizontal" className="my-3" />
          <CommentsList
            comments={props.comments}
            itemTitle={props.metadata.title}
            itemId={props.metadata.slug}
            itemType="stories"
          />
        </div>
        <SubmitOrDonateAside />
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const response = await getAllPublishedStories();
  const paths = response.docs.map((doc) => ({ params: { slug: doc.id } }));
  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<
  SingleStoryProps,
  { slug: string }
> = async (ctx) => {
  const { params } = ctx;
  const storyRes = await getSingleStory(params?.slug ?? "");
  const story = storyRes.data() as StoryDoc;

  if (story.draft)
    return { redirect: { destination: "/content-x", statusCode: 307 } };

  const commentsRes = await getComments("stories", params?.slug ?? "");
  const prefaceFile = await axios.get(story.content ?? "");
  const { content: preface } = grayMatter(prefaceFile.data);

  const metadata = {
    ...story,
    slug: storyRes.id,
    published: isoDateOfTimestamp(story.published),
    lastUpdated: isoDateOfTimestamp(story.lastUpdated),
    chapterCount: story.chapters?.length,
  };

  const chapters =
    story.chapters?.map((ch) => {
      const obj = {
        ...ch,
        published: isoDateOfTimestamp(ch.published),
      };
      delete obj.content;
      return obj;
    }) ?? [];

  delete metadata.chapters;
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
      preface: await serialize(preface),
      metadata,
      chapters,
      comments,
    },
    revalidate: REVAL_TIME,
  };
};
