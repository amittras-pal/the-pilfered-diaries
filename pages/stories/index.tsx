import { GetStaticProps, InferGetStaticPropsType } from "next";
import SubmitOrDonateAside from "../../components/SubmitOrDonateAside";
import Story from "../../components/stories/Story";
import { REVALIDATION_TIME, SITE_TITLE } from "../../constants";
import { getStories } from "../../firebase/server.functions";
import { StoryDoc } from "../../types/entities";
import { StoriesPageProps } from "../../types/page";
import { dateFormat, fbTimestampToDateFormat } from "../../utils/date.utils";

export default function StoriesLIst({
  stories,
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
          {stories.map((story) => (
            <Story {...story} key={story.slug} />
          ))}
        </div>
        <SubmitOrDonateAside />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<StoriesPageProps> = async (
  _ctx
) => {
  const response = await getStories(20);
  const stories = response.docs.map((doc) => {
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

  return {
    props: { stories },
    revalidate: REVALIDATION_TIME,
  };
};
