import { InferType, array, boolean, mixed, object, string } from "yup";

export const loginSchema = object().shape({
  email: string().email("Invalid Identity.").required("Identity is required."),
  password: string().required("Password is required."),
});

export const postSchema = object().shape({
  title: string()
    .required("Title is required")
    .matches(
      /^[A-Za-z0-9\s]*$/,
      "Title must have only alphanumeric characters and spaces."
    ),
  excerpt: string().required("Excerpt is required"),
  author: string()
    .required("Author Name is required")
    .test({
      name: "author",
      message: "You can't be the author if marked as guest.",
      test: (val, ctx) => {
        if (ctx.parent.byGuest && val === "Amittras") return false;
        else return true;
      },
    }),
  postId: string().required(),
  byGuest: boolean(),
  draft: boolean(),
  tags: array().min(1, "Tags are required").max(5, "Upto 5 tags allowed."),
  refreshPassword: string().when("draft", {
    is: false,
    then: (schema) => schema.required("Refresh Password is required."),
    otherwise: (schema) => schema.optional(),
  }),
  content: mixed()
    .nullable()
    .test({
      name: "contentFile",
      message: "Content File is Required!",
      test: (files) => {
        if (((files as FileList)?.length ?? 0) === 0) return false;
        return true;
      },
    }),
  cover: mixed()
    .nullable()
    .test({
      name: "coverFile",
      message: "Cover Image is required!",
      test: (files) => {
        if (((files as FileList)?.length ?? 0) === 0) return false;
        return true;
      },
    })
    .test({
      name: "sameFile",
      message: "Thumbanail and Cover cannot be same",
      test: (files, ctx) => {
        if (
          (files as FileList)?.[0]?.name ===
          (ctx.parent.thumbnail as FileList)?.[0]?.name
        )
          return false;
        return true;
      },
    }),
  thumbnail: mixed()
    .nullable()
    .test({
      name: "coverFile",
      message: "Cover Image is required!",
      test: (files) => {
        if (((files as FileList)?.length ?? 0) === 0) return false;
        return true;
      },
    })
    .test({
      name: "sameFile",
      message: "Thumbanail and Cover cannot be same",
      test: (files, ctx) => {
        if (
          (files as FileList)?.[0]?.name ===
          (ctx.parent.cover as FileList)?.[0]?.name
        )
          return false;
        return true;
      },
    }),
});

export type PostForm = InferType<typeof postSchema>;
export type LoginForm = InferType<typeof loginSchema>;
