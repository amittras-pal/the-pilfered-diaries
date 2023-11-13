import React from "react";
import { Comment } from "../../types/entities";
import { IconCircle, IconMessage2Plus } from "@tabler/icons-react";

interface CommentsListProps {
  comments: Comment[];
  itemTitle: string;
  itemId: string;
}

export default function CommentsList(props: CommentsListProps) {
  return (
    <>
      <div className="flex justify-between items-start">
        <p className="text-xl text-violet-300 font-serif">
          Comments on {props.itemTitle}
        </p>
        <button className="btn btn-sm btn-ghost">
          <IconMessage2Plus size={18} />
          Add Comment
        </button>
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
            <p className="text-lg text-gray-200 font-serif">{comment.title}</p>
            {comment.body && <p className="text-sm">{comment.body}</p>}
          </div>
        ))}
      </div>
    </>
  );
}
