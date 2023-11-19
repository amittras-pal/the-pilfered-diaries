import { firestore, storage } from "@firebase/client.config";
import { yupResolver } from "@hookform/resolvers/yup";
import { IconSend } from "@tabler/icons-react";
import { Timestamp, doc, setDoc } from "firebase/firestore";
import {
  UploadTask,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { revalidatePages } from "../../../axios.services";
import { PostDoc } from "../../../types/entities";
import Loader from "../../Loader";
import FileInput from "../../form/FileInput";
import Input from "../../form/Input";
import TagInput from "../../form/TagInput";
import TextArea from "../../form/TextArea";
import { PostForm, postSchema } from "./schemas";
import { handleFSError, slugify } from "./utils";

interface MediaUrls {
  cover: string;
  thumbnail: string;
  content: string;
}

export default function NewPost() {
  const [uploadStatus, setUploadStatus] = useState("");
  const [mediaUrls, setMediaUrls] = useState<MediaUrls>({
    cover: "",
    thumbnail: "",
    content: "",
  });

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<PostForm>({
    mode: "onBlur",
    shouldFocusError: true,
    defaultValues: {
      author: "Amittras",
      byGuest: false,
      content: null,
      cover: null,
      draft: false,
      excerpt: "",
      tags: [],
      thumbnail: null,
      title: "",
      slug: "",
      refreshPassword: "",
    },
    resolver: yupResolver(postSchema),
  });

  const onFSSuccess = async (task: UploadTask, file: keyof MediaUrls) => {
    const url = await getDownloadURL(task.snapshot.ref);
    setMediaUrls((prev) => ({ ...prev, [file]: url }));
  };

  const completeProcessing = useCallback(() => {
    reset();
    setUploadStatus("");
  }, [reset]);

  useEffect(() => {
    if (mediaUrls.content && mediaUrls.cover && mediaUrls.thumbnail) {
      setUploadStatus("Saving Post...");
      const savePost = async () => {
        const form = getValues();
        try {
          const post: PostDoc = {
            author: form.author,
            byGuest: form.byGuest ?? false,
            draft: form.draft ?? false,
            excerpt: form.excerpt,
            published: Timestamp.fromDate(new Date()),
            tags: form.tags ?? [],
            title: form.title,
            cover: mediaUrls.cover,
            content: mediaUrls.content,
            thumbnail: mediaUrls.thumbnail,
          };
          const docRef = doc(firestore, "posts", form.slug);
          await setDoc(docRef, post);

          if (!form.draft) {
            setUploadStatus("Refreshing Site Pages");
            await revalidatePages(form.refreshPassword ?? "", ["/", "/posts"]);
          }

          setUploadStatus("Completed.");
          setTimeout(completeProcessing, 500);
        } catch (error) {
          console.error(error);
        }
      };
      savePost();
    }
  }, [completeProcessing, getValues, mediaUrls, reset]);

  const uploadFiles: SubmitHandler<PostForm> = (values) => {
    setUploadStatus("Uploading Files...");
    const coverFile = (values.cover as FileList)[0];
    const thumbFile = (values.thumbnail as FileList)[0];
    const contentFile = (values.content as FileList)[0];
    const folder = values.slug;

    const coverRef = ref(storage, `posts/${folder}/cover.avif`);
    const thumbRef = ref(storage, `posts/${folder}/thumb.avif`);
    const contentRef = ref(storage, `posts/${folder}/content.mdx`);

    const coverUp = uploadBytesResumable(coverRef, coverFile);
    const thumbUp = uploadBytesResumable(thumbRef, thumbFile);
    const contentUp = uploadBytesResumable(contentRef, contentFile);

    coverUp.on(
      "state_changed",
      (_snap) => null,
      handleFSError,
      () => onFSSuccess(coverUp, "cover")
    );
    thumbUp.on(
      "state_changed",
      (_snap) => null,
      handleFSError,
      () => onFSSuccess(thumbUp, "thumbnail")
    );
    contentUp.on(
      "state_changed",
      (_snap) => null,
      handleFSError,
      () => onFSSuccess(contentUp, "content")
    );
  };

  return (
    <form onSubmit={handleSubmit(uploadFiles)} noValidate>
      <h2 className="text-xl text-warning mb-2">Create a new Post.</h2>
      <div className="grid grid-cols-3 gap-2">
        <p className="text-lg col-span-3 text-gray-200">Add Post Information</p>
        <div>
          <Input
            autoFocus
            required
            label="Post Title"
            {...register("title")}
            onChange={(e) => {
              register("title").onChange(e);
              setValue("slug", slugify(e));
            }}
            error={errors.title?.message}
          />
          <Input
            {...register("slug")}
            label="Post Slug"
            readOnly
            help="Auto generated from Title"
          />
        </div>
        <div>
          <Input
            {...register("author")}
            required
            label="Post Author"
            readOnly={!watch("byGuest")}
            error={errors.author?.message}
          />
          <div className="flex gap-2 mt-2 items-center">
            <input
              {...register("byGuest")}
              onChange={(e) => {
                register("byGuest").onChange?.(e);
                setValue("author", e.target.checked ? "" : "Amittras", {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                });
              }}
              id="byGuest"
              type="checkbox"
              className="checkbox checkbox-sm rounded-md"
            />
            <label htmlFor="byGuest">By Guest</label>
          </div>
          <div className="flex gap-2 mt-2 items-center">
            <input
              {...register("draft")}
              id="draft"
              type="checkbox"
              className="checkbox checkbox-sm rounded-md"
            />
            <label htmlFor="draft">Draft</label>
          </div>
          {watch("draft") && (
            <p className=" text-red-400 text-sm">
              You will have to manually set the publish date on this post and
              mark it published if set as draft.
            </p>
          )}
        </div>
        <div>
          <TextArea
            {...register("excerpt")}
            label="Post Excerpt"
            required
            rows={5}
            error={errors.excerpt?.message}
          />
        </div>
        <div>
          <TagInput
            help="Press comma to add tag."
            onChange={(e) =>
              setValue("tags", e, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              })
            }
            onBlur={register("tags").onBlur}
            value={watch("tags") ?? []}
            label="Tags"
            required
            error={errors.tags?.message}
          />
        </div>
        <p className="text-lg col-span-3 text-gray-200">Add Media Files</p>
        <div>
          <FileInput
            {...register("content")}
            required
            onChange={(e) => {
              setValue("content", e.target.files, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              });
            }}
            files={watch("content")}
            error={errors.content?.message}
            label="Content File"
            help="MDX File"
            accept=".mdx"
          />
        </div>
        <div>
          <FileInput
            required
            {...register("cover")}
            onChange={(e) => {
              setValue("cover", e.target.files, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              });
            }}
            files={watch("cover")}
            error={errors.cover?.message}
            label="Cover Image"
            help="AVIF Image (Aspect 16:9)"
            accept=".avif"
          />
        </div>
        <div>
          <FileInput
            required
            {...register("thumbnail")}
            onChange={(e) => {
              setValue("thumbnail", e.target.files, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              });
            }}
            files={watch("thumbnail")}
            error={errors.thumbnail?.message}
            label="Thumbnail Image"
            help="AVIF Image (Aspect 1:1)"
            accept=".avif"
          />
        </div>
        <p className="text-lg col-span-3 text-gray-200">Authorization</p>
        <div>
          <Input
            type="password"
            label="Page Revalidation Password"
            required
            error={errors.refreshPassword?.message}
            {...register("refreshPassword")}
          />
        </div>
        <div className="col-span-3 flex justify-end">
          <button
            type="submit"
            className="btn btn-sm btn-success"
            disabled={uploadStatus.length > 0 || !isValid}
          >
            {uploadStatus ? <Loader /> : <IconSend size={18} />}
            {uploadStatus || "Create Post"}
          </button>
        </div>
      </div>
    </form>
  );
}
