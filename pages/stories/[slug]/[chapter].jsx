import {
  IconArrowLeft,
  IconArrowRight,
  IconHome,
  IconPoint,
} from "@tabler/icons";
import axios from "axios";
import grayMatter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import { NextSeo } from "next-seo";
import Link from "next/link";
import React from "react";
import readingTime from "reading-time";
import RenderMarkdown from "../../../components/markdown/RenderMarkdown";
import { AVG_READING_SPEED } from "../../../constants/app.constants";
import firestore from "../../../firebase/config";
import styles from "../../../styles/SingleChapter.module.scss";

export default function SingleChapter({ metadata, content }) {
  return (
    <>
      <NextSeo
        title={metadata.title}
        description={metadata.excerpt}
        openGraph={{
          description: metadata.excerpt,
          type: "article",
          title: metadata.title,
          article: {
            publishedTime: metadata.published,
            tags: metadata.tags,
            authors: [metadata.author],
          },
        }}
      />
      <div className={`container-fluid ${styles["single-story"]}`}>
        <div className={`container px-0 ${styles["single-story__header"]}`}>
          <h1 className="display-3">{metadata.title}</h1>
          <p className="small text-warning mb-0">
            by {metadata.author}
            <span className="mx-2">
              <IconPoint size={12} />
            </span>
            {metadata.readTime.text} ({metadata.readTime.words} words)
          </p>
        </div>
        <div className="container px-1">
          <RenderMarkdown {...content} />
          <div className="row mb-3">
            <div className="col-6 px-0">
              {metadata.previousChapter && (
                <Link
                  className={styles["chapter-toggle"]}
                  href={`/stories/${metadata.parent}/${metadata.previousChapter}`}>
                  <IconArrowLeft size={24} />
                  Previous Chapter
                </Link>
              )}
            </div>
            <div className="col-6 px-0">
              <Link
                className={styles["chapter-toggle"]}
                href={
                  metadata.nextChapter
                    ? `/stories/${metadata.parent}/${metadata.nextChapter}`
                    : `/stories/${metadata.parent}`
                }>
                {metadata.nextChapter ? "Next Chapter" : "Story Home"}
                {metadata.nextChapter ? (
                  <IconArrowRight size={24} />
                ) : (
                  <IconHome size={20} />
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/** @type {import('next').GetStaticPaths} */
export async function getStaticPaths() {
  const paths = (
    await firestore.collection("stories").where("draft", "==", false).get()
  ).docs.flatMap((doc) => {
    const chapterPaths = doc.data().chapterSlugs.map((chapter) => ({
      params: {
        slug: doc.id,
        chapter,
      },
    }));
    return chapterPaths;
  });

  return {
    paths,
    fallback: "blocking",
  };
}

/** @type {import('next').GetStaticProps} */
export async function getStaticProps(ctx) {
  const { params } = ctx;
  const filePath = (
    await firestore
      .doc(`stories/${params.slug}/chapters/${params.chapter}`)
      .get()
  ).data().content;

  const storyFile = await axios.get(filePath);
  const { data: metadata, content: source } = grayMatter(storyFile.data);
  const time = readingTime(source, { wordsPerMinute: AVG_READING_SPEED });
  metadata["readTime"] = time;
  const content = await serialize(source);

  return {
    props: {
      metadata,
      content,
    },
  };
}
