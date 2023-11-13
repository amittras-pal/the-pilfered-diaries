import { DISPLAY_TAGS } from "@constants/app";

interface TagsListProps {
  tags: string[];
  className: string;
  showCount?: number;
}

export default function TagsList({
  tags,
  className,
  showCount,
}: TagsListProps) {
  const toShow = showCount ?? DISPLAY_TAGS;
  return (
    <div className={className}>
      {tags.slice(0, toShow).map((tag) => (
        <span className="badge badge-sm badge-ghost" key={tag}>
          {tag}
        </span>
      ))}
      {tags.length > toShow && (
        <span
          className="badge badge-sm badge-ghost tooltip tooltip-warning border-0"
          data-tip={tags.slice(toShow).join(", ")}
        >
          +{tags.length - toShow}
        </span>
      )}
    </div>
  );
}
