import { MarkdownContent } from "@typeDefs/page";
import { MDXRemote } from "next-mdx-remote";
import styles from "./Markdown.module.css";
import { components } from "./plugins";

export default function Markdown(props: MarkdownContent) {
  /**
   * // TODO:  Validate behaviours with the existing one.
   *        - text size control
   */
  return (
    <div className={styles.markdown} style={{ fontSize: `${16}px` }}>
      <MDXRemote {...props} components={components} />
    </div>
  );
}
