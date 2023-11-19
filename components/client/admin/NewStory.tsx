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
import { defaultAuthor } from "../../../constants/app";
import { firestore, storage } from "../../../firebase/client.config";
import { StoryDoc } from "../../../types/entities";
import Loader from "../../Loader";
import FileInput from "../../form/FileInput";
import Input from "../../form/Input";
import TagInput from "../../form/TagInput";
import TextArea from "../../form/TextArea";
import { StoryForm, storySchema } from "./schemas";
import { handleFSError, slugify } from "./utils";

interface MediaUrls {
  cover: string;
  content: string;
}

export default function NewStory() {
  const [uploadStatus, setUploadStatus] = useState("");
  const [mediaUrls, setMediaUrls] = useState<MediaUrls>({
    cover: "",
    content: "",
  });

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    setValue,
    reset,
    watch,
    getValues,
  } = useForm<StoryForm>({
    mode: "onBlur",
    shouldFocusError: true,
    defaultValues: {
      author: defaultAuthor,
      content: null,
      cover: null,
      excerpt: "",
      tags: [],
      title: "",
      slug: "",
      byGuest: false,
    },
    resolver: yupResolver(storySchema),
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
    if (mediaUrls.content && mediaUrls.cover) {
      setUploadStatus("Saving Story...");
      const saveStory = async () => {
        const form = getValues();
        try {
          const story: StoryDoc = {
            author: form.author,
            byGuest: form.byGuest ?? false,
            draft: true,
            cover: mediaUrls.cover,
            excerpt: form.excerpt,
            lastUpdated: Timestamp.fromDate(new Date()),
            published: Timestamp.fromDate(new Date()),
            tags: form.tags ?? [],
            title: form.title,
            wip: true,
            chapters: [],
            content: mediaUrls.content,
          };
          const docRef = doc(firestore, "stories", form.slug);
          await setDoc(docRef, story);

          // TODO: refresh Pages.
          setUploadStatus("Completed.");
          setTimeout(completeProcessing, 500);
        } catch (error) {
          console.error(error);
        }
      };
      saveStory();
    }
  }, [completeProcessing, getValues, mediaUrls, reset]);

  const uploadFiles: SubmitHandler<StoryForm> = (values) => {
    setUploadStatus("Uploading Files...");
    const coverFile = (values.cover as FileList)[0];
    const contentFile = (values.content as FileList)[0];
    const folder = values.slug;

    const coverRef = ref(storage, `stories/${folder}/cover.avif`);
    const contentRef = ref(storage, `stories/${folder}/preface.mdx`);

    const coverUp = uploadBytesResumable(coverRef, coverFile);
    const contentUp = uploadBytesResumable(contentRef, contentFile);

    coverUp.on(
      "state_changed",
      (_snap) => null,
      handleFSError,
      () => onFSSuccess(coverUp, "cover")
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
      <h2 className="text-xl text-warning mb-2">Create a new Story.</h2>
      <div className="grid grid-cols-3 gap-2">
        <p className="text-lg col-span-3 text-gray-200">
          Add Story Information
        </p>
        <div>
          <Input
            autoFocus
            required
            label="Story Title"
            {...register("title")}
            onChange={(e) => {
              register("title").onChange(e);
              setValue("slug", slugify(e));
            }}
            error={errors.title?.message}
          />
          <Input
            {...register("slug")}
            label="Story Slug"
            readOnly
            help="Auto generated from Title"
          />
        </div>
        <div>
          <Input
            {...register("author")}
            required
            label="Story Author"
            readOnly={!watch("byGuest")}
            error={errors.author?.message}
          />
          <div className="flex gap-2 mt-2 items-center">
            <input
              {...register("byGuest")}
              onChange={(e) => {
                register("byGuest").onChange(e);
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
        </div>
        <div>
          <TextArea
            {...register("excerpt")}
            label="Story Excerpt"
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
            label="Preface File"
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
        <p className="text-lg col-span-3 text-warning mt-2">
          <span className="underline">NOTE:</span> <br /> The story will be
          initiated as draft, and will only be published to the site when you
          create the first chapter in it via the chapter adding module. <br />{" "}
          The story is marked as work-in-progress
        </p>
        <div className="col-span-3 flex justify-end">
          <button
            type="submit"
            className="btn btn-sm btn-success"
            disabled={uploadStatus.length > 0 || !isValid}
          >
            {uploadStatus ? <Loader /> : <IconSend size={18} />}
            {uploadStatus || "Create Story"}
          </button>
        </div>
      </div>
    </form>
  );
}
