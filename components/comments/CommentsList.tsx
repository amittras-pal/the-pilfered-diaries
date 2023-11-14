import { IconCircle, IconMessage2Plus } from "@tabler/icons-react";
import { Comment } from "@typeDefs/entities";
import dynamic from "next/dynamic";
import React from "react";

interface CommentsListProps {
  comments: Comment[];
  itemType: "posts" | "stories";
  itemTitle: string;
  itemId: string;
}

const CommentForm = dynamic(() => import("./CommentForm"), {
  ssr: false,
  loading: () => (
    <p className="text-xs font-thin my-3">Loading Comment Editor...</p>
  ),
});

export default function CommentsList(props: CommentsListProps) {
  const [showForm, setShowForm] = React.useState<boolean>(false);
  const toggleForm = () => setShowForm((v) => !v);

  return (
    <>
      {showForm && (
        <CommentForm
          onClose={toggleForm}
          type={props.itemType}
          target={props.itemId}
        />
      )}
      <div className="flex justify-between items-start">
        <p className="text-xl text-violet-300 ">
          Comments on {props.itemTitle}
        </p>
        {!showForm && (
          <button className="btn btn-sm btn-ghost" onClick={toggleForm}>
            <IconMessage2Plus size={18} />
            Add Comment
          </button>
        )}
      </div>
      <div className="flex flex-col divide-y divide-gray-700">
        {props.comments.map((comment) => (
          <div className="py-3 md:py-4 first:pt-1 last:pb-1" key={comment.id}>
            <div className="flex gap-2 items-center mb-1">
              <p className="text-violet-400 text-sm font-bold">
                {comment.userName}
              </p>
              <p className="text-white">
                <IconCircle size={8} />
              </p>
              <p className="text-violet-400 text-sm">{comment.date}</p>
            </div>
            <p className="text-lg text-gray-200 ">{comment.title}</p>
            {/* TODO: Comment body should preserve formatting. */}
            {comment.body && <p className="text-sm">{comment.body}</p>}
          </div>
        ))}
      </div>
    </>
  );
}
