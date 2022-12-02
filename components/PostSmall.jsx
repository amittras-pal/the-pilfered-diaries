import { IconPoint } from "@tabler/icons";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { DATE_FORMATS } from "@constants/app";
import styles from "../styles/modules/ContentCards.module.scss";
import TagsList from "@components/TagsList";

export default function PostSmall({ post }) {
  return (
    <Link className={styles.sm} key={post.slug} href={`/posts/${post.slug}`}>
      <Image src={post.thumbnail} width={112} height={112} alt={post.slug} />
      <div className={`px-3 py-2 ${styles.sm__content}`}>
        <h4 className="mb-1">{post.title}</h4>
        <p className="small text-light text-truncate mb-2">{post.excerpt}</p>
        <p className="small text-muted mb-2">
          {dayjs(post.published).format(DATE_FORMATS.date)}
          <IconPoint size={8} style={{ margin: "0px 4px" }} />
          {post.author}
        </p>
        <TagsList tags={post.tags} showCount={2} />
      </div>
    </Link>
  );
}
