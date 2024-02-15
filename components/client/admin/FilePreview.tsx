import { MarkdownContent } from "@typeDefs/page";
import grayMatter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import { useEffect, useState } from "react";
import readingTime, { ReadTimeResults } from "reading-time";
import { AVG_WPM } from "../../../constants/app";
import { getReadingTime } from "../../../utils/app.utils";
import Markdown from "../../markdown/Markdown";

export default function FilePreview() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [fileContent, setFileContent] = useState<MarkdownContent | null>(null);
  const [readTime, setReadTime] = useState<ReadTimeResults | null>(null);

  useEffect(() => {
    if ((files?.length ?? 0) > 0) {
      const file = files?.item(0);
      const reader = new FileReader();
      reader.onloadend = async (e) => {
        const { content } = grayMatter((e.target?.result as string) ?? "");
        const renderObj = await serialize(content, {
          mdxOptions: { development: process.env.NODE_ENV === "development" },
        });
        const time = readingTime(content, { wordsPerMinute: AVG_WPM });
        setReadTime(time);
        setFileContent(renderObj);
      };
      if (file instanceof Blob) reader.readAsText(file);
    } else {
      setFileContent(null);
      setFiles(null);
    }
  }, [files]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
        <input
          onChange={(e) => setFiles(e.target.files)}
          type="file"
          accept=".mdx"
          className="file-input file-input-sm file-input-bordered w-full max-w-xs"
        />
        {readTime !== null && (
          <p className="text-green-200">{getReadingTime(readTime, false)}</p>
        )}
      </div>
      {fileContent !== null && (
        <div className="flex-grow overflow-y-auto scroll-smooth p-2">
          <Markdown {...fileContent} />
        </div>
      )}
    </div>
  );
}
