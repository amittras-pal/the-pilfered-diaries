import Divider from "@components/Divider";
import CommentsList from "@components/comments/CommentsList";
import Markdown from "@components/markdown/Markdown";
import ChapterHeader from "@components/stories/ChapterHeader";
import { AVG_WPM, REVAL_TIME } from "@constants/app";
import {
  getAllPublishedStories,
  getComments,
  getSingleStory,
} from "@firebase/server.functions";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { CommentDoc, StoryDoc } from "@typeDefs/entities";
import { SingleChapterProps } from "@typeDefs/page";
import {
  dateFormat,
  dateTimeFormat,
  fbTimestampToDateFormat,
} from "@utils/date.utils";
import axios from "axios";
import grayMatter from "gray-matter";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { serialize } from "next-mdx-remote/serialize";
import Link from "next/link";
import { ParsedUrlQuery } from "querystring";
import readingTime from "reading-time";
import SubmitOrDonateAside from "../../../components/aside-cta/AsideCTA";

export default function SingleChapter(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  return (
    <>
      <ChapterHeader
        chapter={props.chapter}
        story={props.story}
        readTime={props.readTime}
      />
      <div
        id="content"
        className="my-6 max-w-screen-xl mx-auto px-3 md:px-4 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-violet-300"
      >
        <div className="basis-9/12 px-0 md:px-2">
          <Markdown {...props.content} />
          <div className="mb-4 flex gap-2 justify-between md:justify-end">
            {props.chapter.previousChapter && (
              <Link
                href={`/stories/${props.story.slug}/${props.chapter.previousChapter}`}
                className="btn btn-ghost btn-sm gap-2"
              >
                <IconArrowLeft size={18} /> Previous
              </Link>
            )}
            {props.chapter.nextChapter ? (
              <Link
                href={`/stories/${props.story.slug}/${props.chapter.nextChapter}`}
                className="btn btn-ghost btn-sm gap-2"
              >
                Next <IconArrowRight size={18} />
              </Link>
            ) : (
              <Link href={"/stories"} className="btn btn-ghost btn-sm gap-2">
                Explore More Stories <IconArrowRight size={18} />
              </Link>
            )}
          </div>
          <Divider direction="horizontal" className="my-3" />
          <CommentsList
            comments={props.comments}
            itemTitle={props.story.title}
            itemId={props.story.slug}
            itemType="stories"
          />
        </div>
        <SubmitOrDonateAside />
      </div>
    </>
  );
}

interface ChapterParams extends ParsedUrlQuery {
  slug: string;
  chapter: string;
}

export const getStaticPaths: GetStaticPaths<ChapterParams> = async () => {
  const storiesRes = await getAllPublishedStories();
  const paths = storiesRes.docs.flatMap((story) => {
    const storyDoc = story.data() as StoryDoc;
    const pathVars =
      storyDoc.chapters?.map((ch) => ({
        params: { slug: story.id, chapter: ch.id },
      })) ?? [];

    return pathVars;
  });

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<
  SingleChapterProps,
  ChapterParams
> = async (ctx) => {
  const { params } = ctx;
  const storyRes = await getSingleStory(params?.slug ?? "");
  const story = storyRes.data() as StoryDoc;

  if (story.draft)
    return { redirect: { destination: "/content-x", statusCode: 307 } };

  const chapter =
    story.chapters?.find((ch) => ch.id === params?.chapter) ?? null;

  if (!chapter)
    return { redirect: { destination: "/content-x", statusCode: 307 } };

  const commentsRes = await getComments("stories", params?.slug ?? "");
  const file = await axios.get(chapter.content ?? "");
  const { content } = grayMatter(file.data);
  const readTime = readingTime(content, { wordsPerMinute: AVG_WPM });

  delete chapter.content;

  const comments = commentsRes.docs.map((cm) => {
    const cmnt = cm.data() as CommentDoc;
    return {
      ...cmnt,
      date: fbTimestampToDateFormat(cmnt.date, dateTimeFormat),
      id: cm.id,
    };
  });

  const props = {
    chapter: {
      ...chapter,
      published: fbTimestampToDateFormat(chapter.published, dateFormat),
    },
    content: await serialize(content),
    readTime: readTime,
    story: { title: story.title, cover: story.cover, slug: storyRes.id },
    comments,
  };

  return { props, revalidate: REVAL_TIME };
};
