import axios from "axios";
import grayMatter from "gray-matter";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { serialize } from "next-mdx-remote/serialize";
import { ParsedUrlQuery } from "querystring";
import readingTime from "reading-time";
import { AVG_WPM, REVAL_TIME } from "../../../constants";
import {
  getAllPublishedStories,
  getComments,
  getSingleStory,
} from "../../../firebase/server.functions";
import { CommentDoc, StoryDoc } from "../../../types/entities";
import { SingleChapterProps } from "../../../types/page";
import {
  dateFormat,
  dateTimeFormat,
  fbTimestampToDateFormat,
} from "../../../utils/date.utils";
import ChapterHeader from "../../../components/stories/ChapterHeader";
import Markdown from "../../../components/markdown/Markdown";
import Divider from "../../../components/Divider";
import CommentsList from "../../../components/comments/CommentsList";

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
      <div id="content" className="my-6 max-w-screen-xl mx-auto px-3 md:px-4">
        <Markdown {...props.content} />
        <Divider direction="horizontal" className="my-3" />
        <CommentsList
          comments={props.comments}
          itemTitle={props.story.title}
          itemId={props.story.slug}
        />
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
