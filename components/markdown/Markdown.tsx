import { MDXRemote } from "next-mdx-remote";
import { MarkdownContent } from "../../types/page";
import { components } from "./plugins";

export default function Markdown(props: MarkdownContent) {
  /**
   * // TODO:  Validate behaviours with the existing one.
   *        - text size control
   *        - fragment linking
   *        - ... other features from existing app.
   */
  return (
    <div className="markdown" style={{ fontSize: `${14}px` }}>
      <MDXRemote {...props} components={components} />
    </div>
  );
}
