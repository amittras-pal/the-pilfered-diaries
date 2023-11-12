import { MDXRemote } from "next-mdx-remote";
import Link from "next/link";
import AuthorNoteSeparator from "./AuthorNoteSeparator";
import SectionBreak from "./SectionBreak";

export default function Markdown({ source }: { source: any }) {
  return (
    <div className="markdown" style={{ fontSize: `${14}px` }}>
      <MDXRemote
        compiledSource={source}
        components={{ SectionBreak, AuthorNoteSeparator, Link }}
        frontmatter={null}
        scope={null}
      />
    </div>
  );
}
