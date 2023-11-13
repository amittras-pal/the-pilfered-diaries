import { ReadTimeResults } from "reading-time";

export function baseUrl(path: string): string {
  return process.env.NEXT_PUBLIC_SITE_URL + path;
}

export const numCompacter = Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function getReadingTime(readTime: ReadTimeResults): string {
  const time = readTime.text.split(" ").slice(0, 2).join(" ");
  const words = numCompacter.format(readTime.words);

  return `${time} (${words} words)`;
}
