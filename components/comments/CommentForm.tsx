"use client";

import Input from "@components/form/Input";
import TextArea from "@components/form/TextArea";
import { auth, firestore } from "@firebase/client.config";
import { yupResolver } from "@hookform/resolvers/yup";
import { IconMessage2Check, IconMessage2X } from "@tabler/icons-react";
import { CommentDoc } from "@typeDefs/entities";
import { User, onAuthStateChanged } from "firebase/auth";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { InferType, object, string } from "yup";
import Loader from "../Loader";

const commentSchema = object().shape({
  userName: string().required("Name is required."),
  email: string().optional().email("Invalid Email."),
  title: string().required("Comment title is required."),
  body: string().optional(),
});

type CommentForm = InferType<typeof commentSchema>;
interface CommentFormProps {
  type: "posts" | "stories";
  target: string;
  onClose: () => void;
}

export default function CommentForm(props: CommentFormProps) {
  const [user, setUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [commentSaved, setCommentSaved] = useState<boolean>(false);

  useEffect(() => {
    if (commentSaved) setTimeout(props.onClose, 2000);
  }, [commentSaved, props.onClose]);

  const {
    handleSubmit,
    reset,
    register,
    setValue,
    setFocus,
    formState: { errors },
  } = useForm<CommentForm>({
    mode: "onBlur",
    shouldFocusError: true,
    defaultValues: {
      userName: "",
      title: "",
      email: "",
      body: "",
    },
    resolver: yupResolver(commentSchema),
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.uid !== process.env.NEXT_PUBLIC_ADMIN_ID) {
        setValue("userName", user.displayName ?? "");
        setValue("email", user.email ?? "");
        setUser(user);
        setFocus("title");
      }
    });
    return unsubscribe;
  }, [setFocus, setValue]);

  const onSubmit: SubmitHandler<CommentForm> = async (values) => {
    const commentDoc: CommentDoc = {
      userName: values.userName,
      title: values.title,
      email: values.email ?? "",
      body: values.body ?? "",
      approved: false,
      date: Timestamp.fromDate(new Date()),
      target: props.target,
      type: props.type,
    };

    try {
      setSubmitting(true);
      const ref = collection(firestore, "comments");
      const res = await addDoc(ref, commentDoc);
      if (res.id) setCommentSaved(true);
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    reset();
    props.onClose();
  };

  // TODO: sign out and comment as a different user.
  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onReset={handleReset}
        noValidate
        className="my-3"
      >
        <p className="text-lg text-gray-400 ">Add New Comment</p>
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2 mb-3">
          <Input
            label="Your Name"
            autoFocus
            required
            readOnly={Boolean(user)}
            help={user ? "You are logged in as this user." : ""}
            error={errors.userName?.message ?? ""}
            disabled={submitting || commentSaved}
            {...register("userName")}
          />
          <Input
            label="Email"
            readOnly={Boolean(user)}
            help={user ? "You are logged in as this user." : ""}
            error={errors.email?.message ?? ""}
            disabled={submitting || commentSaved}
            {...register("email")}
          />
          <Input
            label="Comment Title"
            required
            className="col-span-1 md:col-span-2"
            error={errors.title?.message ?? ""}
            disabled={submitting || commentSaved}
            {...register("title")}
          />
          <TextArea
            rows={5}
            label="Comment Body"
            className="col-span-1 md:col-span-2"
            help="Your Comment will be made public within 24 hours."
            disabled={submitting || commentSaved}
            {...register("body")}
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="reset"
            className="btn btn-sm btn-ghost btn-error"
            disabled={submitting}
          >
            <IconMessage2X size={18} />
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-sm btn-success"
            disabled={submitting || commentSaved}
          >
            {submitting ? <Loader /> : <IconMessage2Check size={18} />}
            Submit Comment
          </button>
        </div>
      </form>
      {commentSaved && (
        <div className="toast toast-center shadow-md">
          <div className="alert alert-success grid-flow-col font-body">
            <span>Comment Saved!</span>
            <span className="text-xs">Will be published after moderation.</span>
          </div>
        </div>
      )}
    </>
  );
}
