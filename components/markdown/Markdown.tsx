import { MarkdownContent } from "@typeDefs/page";
import { MDXRemote } from "next-mdx-remote";
import { useCallback, useEffect, useState } from "react";
import styles from "./Markdown.module.css";
import { components } from "./plugins";

export default function Markdown(props: MarkdownContent) {
  const [fontSize, setFontSize] = useState(16);
  const handleSizeChange = useCallback(() => {
    const size = parseFloat(localStorage.getItem("fontSize") ?? "16");
    setFontSize(size);
  }, []);

  useEffect(() => {
    handleSizeChange();
    window.addEventListener("fontSize", handleSizeChange);
    return () => window.removeEventListener("fontSize", handleSizeChange);
  }, [handleSizeChange]);

  return (
    <div
      className={styles.markdown}
      style={{ fontSize: `${fontSize}px` }}
      id="content-section"
    >
      <MDXRemote {...props} components={components} />
    </div>
  );
}
