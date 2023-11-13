import axios from "axios";
import grayMatter from "gray-matter";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { serialize } from "next-mdx-remote/serialize";
import Markdown from "../../../components/markdown/Markdown";
import ChaptersList from "../../../components/stories/ChaptersList";
import StoryHeader from "../../../components/stories/StoryHeader";
import { REVAL_TIME } from "../../../constants";
import {
  getAllPublishedStories,
  getSingleStory,
} from "../../../firebase/server.functions";
import { StoryDoc } from "../../../types/entities";
import { SingleStoryProps } from "../../../types/page";
import { dateFormat, fbTimestampToDateFormat } from "../../../utils/date.utils";

export default function SingleStory(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  return (
    <>
      <StoryHeader metadata={props.metadata} />
      <div id="content" className="my-6 max-w-screen-xl mx-auto px-3 md:px-4">
        <h2 className="text-2xl text-violet-300 font-serif">Preface</h2>
        <Markdown {...props.preface} />
        <ChaptersList chapters={props.chapters} slug={props.metadata.slug} />
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

  const prefaceFile = await axios.get(story.content ?? "");
  const { content: preface } = grayMatter(prefaceFile.data);

  const metadata = {
    ...story,
    slug: storyRes.id,
    published: fbTimestampToDateFormat(story.published, dateFormat),
    lastUpdated: fbTimestampToDateFormat(story.lastUpdated, dateFormat),
    chapterCount: story.chapters?.length,
  };

  const chapters =
    story.chapters?.map((ch) => {
      const obj = {
        ...ch,
        published: fbTimestampToDateFormat(ch.published, dateFormat),
      };
      delete obj.content;
      return obj;
    }) ?? [];

  delete metadata.chapters;
  delete metadata.content;

  return {
    props: {
      preface: await serialize(preface),
      metadata,
      chapters,
    },
    revalidate: REVAL_TIME,
  };
};
