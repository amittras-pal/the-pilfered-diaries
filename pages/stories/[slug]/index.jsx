import { IconArrowDown, IconArrowRight, IconPoint } from "@tabler/icons";
import axios from "axios";
import dayjs from "dayjs";
import grayMatter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import CommentsList from "../../../components/commentsList/CommentsList";
import ContentCardLarge from "../../../components/contentCards/ContentCardLarge";
import RenderMarkdown from "../../../components/markdown/RenderMarkdown";
import TagsList from "../../../components/tagsList/TagsList";
import {
  APP_TITLE,
  DATE_FORMATS,
  ISR_INTERVAL,
} from "../../../constants/app.constants";
import firestore from "../../../firebase/config";
import {
  commentsList,
  getRelatedStories,
} from "../../../services/serverData.promises";
import styles from "../../../styles/SingleStory.module.scss";
import { scrollToContent } from "../../../utils/utils";

export default function StoryDetails({
  story,
  chapters,
  comments = [],
  relatedStories = [],
}) {
  const router = useRouter();
  // TODO: Create a loading component
  if (router.isFallback) return "Loading...";

  return (
    <>
      <NextSeo
        title={story.title}
        description={story.excerpt}
        openGraph={{
          description: story.excerpt,
          type: "article",
          title: story.title,
          article: {
            publishedTime: story.published,
            tags: story.tags,
            authors: [story.author],
          },
          images: [
            {
              url: story.cover,
              width: 1280,
              height: 720,
              alt: story.slug + "-cover",
            },
          ],
        }}
      />
      <div className={styles["single-story"]}>
        <div
          className={`container-fluid shadow ${styles["single-story__header"]}`}
          style={{ backgroundImage: `url(${story.cover})` }}
        >
          <h1 className="display-1">{story.title}</h1>
          <p className="my-3">
            <span className="me-1">{story.author}</span>
            <span className="mx-1 text-primary">
              <IconPoint size={16} />
            </span>
            <span className="mx-1">{story.chapterCount} Chapters</span>
            <span className="mx-1 text-primary">
              <IconPoint size={16} />
            </span>
            <span className="ms-1">
              {dayjs(story.published).format(DATE_FORMATS.date)}
            </span>
          </p>
          <p className={styles["story-excerpt"]}>{story.excerpt}</p>
          <button
            className="icon-btn icon-btn__lg mt-3"
            data-bs-toggle="tooltip"
            data-bs-offset="0,5"
            data-bs-placement="bottom"
            title="Scroll To Content"
            onClick={() => scrollToContent("contentBlock")}
          >
            <IconArrowDown size={36} />
          </button>
        </div>
        <div className="container my-4 py-3" id="contentBlock">
          <h2 className="text-primary">Preface</h2>
          <div className="my-2">
            <TagsList tags={story.tags} />
          </div>
          <RenderMarkdown {...story.preface} />
          <h2 className="text-primary mt-4">Chapters</h2>
          <div className="row mt-3 mt-md-4">
            {chapters.map((ch) => (
              <div className="col-md-6 mb-3 mb-md-4" key={ch.slug}>
                <Link
                  href={`/stories/${story.slug}/${ch.slug}`}
                  className={`shadow ${styles["chapter-card"]}`}
                >
                  <h4 className="mb-2">{ch.title}</h4>
                  <p className="small mb-0">{ch.excerpt}</p>
                </Link>
              </div>
            ))}
          </div>
          <CommentsList
            type="stories"
            title={story.title}
            comments={comments}
            target={story.slug}
          />
          <p className="h3 mb-1 text-primary">
            More Like this on {APP_TITLE}...
          </p>
          {relatedStories.length > 0 ? (
            <div className="row mt-3">
              {relatedStories.map((story) => (
                <div className="col-md-6 mb-3" key={story.slug}>
                  <ContentCardLarge data={story} variant="stories" />
                </div>
              ))}
            </div>
          ) : (
            <div className="d-flex justify-content-center my-3">
              <Link className="btn btn-primary" href="/stories">
                <span className="me-1">View All Stories</span>
                <IconArrowRight size={18} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/** @type {import('next').GetStaticPaths} */
export async function getStaticPaths() {
  const response = await firestore
    .collection("stories")
    .where("draft", "==", false)
    .orderBy("published", "desc")
    .get();
  const paths = response.docs.map((doc) => ({
    params: {
      slug: doc.id,
    },
  }));

  return {
    paths,
    fallback: true,
  };
}

/** @type {import('next').GetStaticProps} */
export async function getStaticProps(ctx) {
  const { params } = ctx;

  const storyRes = await firestore.doc(`stories/${params.slug}`).get();
  const prefaceRes = await axios.get(storyRes.data().content);
  const commentsRes = await commentsList("stories", params.slug);
  const chapterRes = await firestore
    .collection(`stories/${params.slug}/chapters`)
    .orderBy("order", "asc")
    .get();
  const relatedStoriesRes = await getRelatedStories(
    params.slug,
    storyRes.data().tags
  );

  const { content: prefaceRaw } = grayMatter(prefaceRes.data);
  const story = {
    ...storyRes.data(),
    slug: storyRes.id,
    published: storyRes.data().published.toDate().toISOString(),
    preface: await serialize(prefaceRaw),
  };
  const chapters = chapterRes.docs.map((doc) => ({
    ...doc.data(),
    slug: doc.id,
  }));

  return {
    props: {
      story,
      chapters,
      comments: commentsRes.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        date: doc.data().date.toDate().toISOString(),
      })),
      relatedStories: relatedStoriesRes.docs.map((doc) => ({
        ...doc.data(),
        slug: doc.id,
        published: doc.data().published.toDate().toISOString(),
      })),
    },
    revalidate: ISR_INTERVAL,
  };
}
