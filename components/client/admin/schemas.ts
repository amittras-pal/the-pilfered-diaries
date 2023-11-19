import { InferType, array, boolean, mixed, number, object, string } from "yup";

export const loginSchema = object().shape({
  email: string().email("Invalid Identity.").required("Identity is required."),
  password: string().required("Password is required."),
});

const mdxRequiredTest = mixed()
  .nullable()
  .test({
    name: "contentFile",
    message: "Content File is Required!",
    test: (files) => ((files as FileList)?.length ?? 0) > 0,
  });

const avifRequiredTest = mixed()
  .nullable()
  .test({
    name: "coverFile",
    message: "Cover Image is required!",
    test: (files) => ((files as FileList)?.length ?? 0) > 0,
  });

const authorTest = string()
  .required("Author Name is required")
  .test({
    name: "author",
    message: "You can't be the author if marked as guest.",
    test: (val, ctx) => {
      if (ctx.parent.byGuest && val === "Amittras") return false;
      else return true;
    },
  });

const titleTest = string()
  .required("Title is required")
  .matches(
    /^[A-Za-z0-9\s]*$/,
    "Title must have only alphanumeric characters and spaces."
  );

export const postSchema = object().shape({
  title: titleTest,
  excerpt: string().required("Excerpt is required"),
  author: authorTest,
  slug: string().required(),
  byGuest: boolean(),
  draft: boolean(),
  tags: array().min(1, "Tags are required").max(5, "Upto 5 tags allowed."),
  refreshPassword: string().when("draft", {
    is: false,
    then: (schema) => schema.required("Refresh Password is required."),
    otherwise: (schema) => schema.optional(),
  }),
  content: mdxRequiredTest,
  cover: avifRequiredTest.test({
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
  thumbnail: avifRequiredTest.test({
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

export const storySchema = object().shape({
  excerpt: string().required("Excerpt is required"),
  title: titleTest,
  author: authorTest,
  tags: array().min(1, "Tags are required").max(5, "Upto 5 tags allowed."),
  content: mdxRequiredTest,
  cover: avifRequiredTest,
  slug: string().required(),
  byGuest: boolean(),
  // draft: boolean(),
});

export const chapterSchema = object().shape({
  // author: authorTest,
  // byGuest: boolean(),
  content: mdxRequiredTest,
  excerpt: string().required("Excerpt is required"),
  id: string().required(),
  order: number().required(),
  // previousChapter: string(),
  // nextChapter: string(),
  title: titleTest,
  markFinished: boolean(),
  refreshPassword: string().required("Refresh Password Is Required."),
});

export type PostForm = InferType<typeof postSchema>;
export type StoryForm = InferType<typeof storySchema>;
export type ChapterForm = InferType<typeof chapterSchema>;
export type LoginForm = InferType<typeof loginSchema>;
