"use client";

import Input from "@components/form/Input";
import TextArea from "@components/form/TextArea";
import { yupResolver } from "@hookform/resolvers/yup";
import { IconMessage2Check, IconMessage2X } from "@tabler/icons-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { InferType, object, string } from "yup";

const commentSchema = object().shape({
  userName: string().required("Name is required."),
  email: string().optional().email("Invalid Email."),
  title: string().required("Comment title is required."),
  body: string().optional(),
});

type CommentForm = InferType<typeof commentSchema>;

export default function CommentForm(props: { onClose: () => void }) {
  const {
    handleSubmit,
    reset,
    register,
    setValue,
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

  const onSubmit: SubmitHandler<CommentForm> = (values) => {
    console.log(values);
  };

  const handleReset = () => {
    reset();
    props.onClose();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onReset={handleReset}
      noValidate
      className="my-3"
    >
      <p className="text-lg text-gray-400 font-serif">Add New Comment</p>
      <div className="grid gap-3 grid-cols-1 md:grid-cols-2 mb-3">
        <Input
          label="Your Name"
          autoFocus
          required
          error={errors.userName?.message ?? ""}
          {...register("userName")}
        />
        <Input
          label="Email"
          error={errors.email?.message ?? ""}
          {...register("email")}
        />
        <Input
          label="Comment Title"
          required
          className="col-span-1 md:col-span-2"
          error={errors.title?.message ?? ""}
          {...register("title")}
        />
        <TextArea
          rows={5}
          label="Comment Body"
          className="col-span-1 md:col-span-2"
        />
      </div>

      <div className="flex gap-3 justify-end">
        <button type="reset" className="btn btn-sm btn-ghost btn-error">
          <IconMessage2X size={18} />
          Cancel
        </button>
        <button type="submit" className="btn btn-sm btn-success">
          <IconMessage2Check size={18} />
          Submit Comment
        </button>
      </div>
    </form>
  );
}
