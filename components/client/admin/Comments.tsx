import { IconChecks, IconTrash } from "@tabler/icons-react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { firestore } from "../../../firebase/client.config";
import Loader from "../../Loader";
import { useCommentsList } from "./hooks";

const Comments = () => {
  const [processing, setProcessing] = useState<string>("");
  const [selection, setSelection] = useState<string[]>([]);
  const comments = useCommentsList();

  const handleSelection: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.checked) {
      setSelection((prev) => [...prev, e.target.value]);
      //   if (!workingSet) {
      //     const commentInfo = comments.find((i) => i.id === e.target.value);
      //     setWorkingSet(`${commentInfo.type}/${commentInfo.target}`);
      //   }
    } else {
      const remainingComments = selection.filter((c) => c !== e.target.value);
      setSelection(remainingComments);
      //   if (remainingComments.length === 0) setWorkingSet("");
    }
  };

  const handleDelete = async () => {
    setProcessing("deleting");
    try {
      const deletions = selection.map((cmt) =>
        deleteDoc(doc(firestore, "comments", cmt))
      );
      await Promise.all(deletions);
      setSelection([]);
    } catch (err) {
      console.log(err);
    } finally {
      setProcessing("");
    }
  };

  const handleApprove = async () => {
    setProcessing("approving");
    try {
      const updates = selection.map((comment) => {
        return updateDoc(doc(firestore, "comments", comment), {
          approved: true,
        });
      });
      await Promise.all(updates);
      setSelection([]);
    } catch (err) {
      console.log(err);
    } finally {
      setProcessing("");
    }
  };

  return (
    <>
      <div>
        {comments.length > 0 ? (
          comments.map((cmt) => (
            <div
              key={cmt.id}
              className="py-2 border-b border-gray-700 last:border-b-0 first:pt-0 flex gap-2"
            >
              <input
                type="checkbox"
                value={cmt.id}
                checked={selection.includes(cmt.id)}
                onChange={handleSelection}
                className="checkbox checkbox-sm rounded-md mt-1"
              />
              <div>
                <p>
                  <span className="text-gray-200">
                    {cmt.userName} {cmt.email ? `(${cmt.email})` : ""}
                  </span>
                  <span className="text-gray-500"> posted at </span>
                  <span className="text-gray-200">{cmt.date}</span>
                </p>
                <p className="text-warning ">{cmt.title}</p>
                {cmt.body && <p className="whitespace-pre-wrap">{cmt.body}</p>}
                <p>
                  For {cmt.type.slice(0, cmt.type.length - 1)}:{" "}
                  <span className="text-gray-200">{cmt.target}</span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full h-full border border-gray-700 rounded-box p-6">
            <h2 className="text-center text-3xl text-warning">
              No New Comments!
            </h2>
          </div>
        )}
      </div>
      {selection.length > 0 && (
        <div className="toast toast-end">
          <div className="alert p-3 flex flex-col gap-2 border border-gray-700 shadow-md items-start">
            <h4>{selection.length} selected.</h4>
            <div className="flex gap-3">
              <button
                disabled={processing === "approving"}
                className="btn btn-sm normal-case btn-success"
                onClick={handleApprove}
              >
                {processing === "approving" ? (
                  <Loader />
                ) : (
                  <IconChecks size={18} />
                )}
                Approve
              </button>
              <button
                disabled={processing === "deleting"}
                className="btn btn-sm normal-case btn-error"
                onClick={handleDelete}
              >
                {processing === "deleting" ? (
                  <Loader />
                ) : (
                  <IconTrash size={18} />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Comments;
