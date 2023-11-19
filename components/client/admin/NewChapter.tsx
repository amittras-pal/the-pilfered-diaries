import { yupResolver } from "@hookform/resolvers/yup";
import { IconSend, IconX } from "@tabler/icons-react";
import { Timestamp, doc, setDoc } from "firebase/firestore";
import {
  StorageError,
  UploadTask,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { firestore, storage } from "../../../firebase/client.config";
import { Story } from "../../../types/entities";
import Loader from "../../Loader";
import FileInput from "../../form/FileInput";
import Input from "../../form/Input";
import TextArea from "../../form/TextArea";
import { useWIPStories } from "./hooks";
import { ChapterForm, chapterSchema } from "./schemas";
import { handleFSError } from "./utils";

export default function NewChapter() {
  const [uploadStatus, setUploadStatus] = useState("");
  const [targetStory, setTargetStory] = useState<Story | null>(null);

  const wip = useWIPStories();

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    setValue,
    reset,
    watch,
    getValues,
  } = useForm<ChapterForm>({
    mode: "onBlur",
    shouldFocusError: true,
    defaultValues: {
      content: null,
      excerpt: "",
      title: "",
      id: "",
      order: 1,
      markFinished: false,
      refreshPassword: "",
    },
    resolver: yupResolver(chapterSchema),
  });

  const handleSelection: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const selection = wip.find((st) => st.title === e.target.value) ?? null;

    setValue("order", (selection?.chapters?.length ?? 0) + 1);
    setValue("id", `chapter-${(selection?.chapters?.length ?? 0) + 1}`);
    setTargetStory(selection);
  };

  const onFSSuccess = async (task: UploadTask) => {
    setUploadStatus("Updating Records...");
    const form = getValues();
    const url = await getDownloadURL(task.snapshot.ref);
    const chapter = {
      author: targetStory?.author ?? "",
      excerpt: form.excerpt,
      id: form.id,
      nextChapter: "",
      previousChapter: targetStory?.chapters?.at(-1)?.id ?? "",
      order: form.order,
      published: Timestamp.fromDate(new Date()),
      title: form.title,
      content: url,
    };

    // Update list of chapters.
    const updatedChapters = [...(targetStory?.chapters ?? [])];
    if (updatedChapters.length > 0)
      updatedChapters[updatedChapters.length - 1].nextChapter = chapter.id;
    // @ts-ignore
    updatedChapters.push(chapter);

    const storyUpdate = {
      ...(targetStory ?? {}),
      lastUpdated: Timestamp.fromDate(new Date()),
      wip: !form.markFinished,
      draft: false,
      chapters: updatedChapters,
    };

    const storyRef = doc(firestore, "stories", targetStory?.slug ?? "");
    await setDoc(storyRef, storyUpdate, { merge: true });

    completeProcessing();
  };

  const completeProcessing = useCallback(() => {
    reset();
    setUploadStatus("");
    setTargetStory(null);
  }, [reset]);

  const uploadFiles: SubmitHandler<ChapterForm> = (values) => {
    setUploadStatus("Uploading Files...");
    const contentFile = (values.content as FileList)[0];
    const folder = targetStory?.slug ?? "";

    const contentRef = ref(storage, `stories/${folder}/${values.id}.mdx`);

    const contentUp = uploadBytesResumable(contentRef, contentFile);
    contentUp.on(
      "state_changed",
      (_snap) => null,
      handleFSError,
      () => onFSSuccess(contentUp)
    );
  };

  return (
    <form onSubmit={handleSubmit(uploadFiles)} noValidate autoComplete="off">
      <h2 className="text-xl text-warning mb-2">
        Add Chapter to an Ongoing Story
      </h2>
      <div className="grid grid-cols-3 gap-2">
        <p className="text-lg col-span-1 text-gray-200">Pick a Story</p>
        <div className="col-span-2">
          <select
            className="select select-bordered select-sm w-full max-w-xs"
            value={targetStory?.title ?? ""}
            disabled={Boolean(targetStory)}
            onChange={handleSelection}
          >
            <option>Select a WIP Story</option>
            {wip.map((story) => (
              <option value={story.title} key={story.slug}>
                {story.title}
              </option>
            ))}
          </select>
        </div>
        {targetStory !== null && (
          <>
            <p className="text-lg col-span-3 text-gray-200">
              Add Chapter Information
            </p>
            <div>
              <Input
                autoFocus
                required
                label="Chapter Title"
                {...register("title")}
                error={errors.title?.message}
              />
              <div className="flex gap-2 mt-2 items-center">
                <input
                  {...register("markFinished")}
                  id="markFinished"
                  type="checkbox"
                  className="checkbox checkbox-sm rounded-md"
                />
                <label htmlFor="markFinished">Mark Story as Finished</label>
              </div>
              {watch("markFinished") && (
                <p className=" text-red-400 text-sm">
                  No more chapters can be added after marking a story as
                  finished
                </p>
              )}
            </div>
            <div>
              <TextArea
                {...register("excerpt")}
                label="Chapter Excerpt"
                required
                rows={5}
                error={errors.excerpt?.message}
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Add Media File</span>
                <span className="label-text text-red-400 mr-auto ml-1">*</span>
              </label>
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
              <p className="text-lg text-gray-200">
                Auto Generated Information
              </p>
              <p>
                <span>Previous Chapter: </span>
                <span className="text-gray-200">
                  {watch("order") === 1
                    ? "N.A."
                    : targetStory.chapters?.at(-1)?.id ?? ""}
                </span>
              </p>
              <p>
                <span>Chapter Slug: </span>
                <span className="text-gray-200">{watch("id")}</span>
              </p>
              <p>
                <span>Author: </span>
                <span className="text-gray-200">{targetStory.author}</span>
              </p>
            </div>
            <div>
              <p className="text-lg text-gray-200">Authorization</p>
              <Input
                type="password"
                label="Page Revalidation Password"
                required
                error={errors.refreshPassword?.message}
                {...register("refreshPassword")}
              />
            </div>
            <div className="col-span-3 flex gap-2 justify-end">
              <button
                type="button"
                className="btn btn-sm btn-warning"
                onClick={() => {
                  reset();
                  setTargetStory(null);
                }}
              >
                <IconX size={18} />
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-sm btn-success"
                disabled={uploadStatus.length > 0 || !isValid}
              >
                {uploadStatus ? <Loader /> : <IconSend size={18} />}
                {uploadStatus || "Create Chapter"}
              </button>
            </div>
          </>
        )}
      </div>
    </form>
  );
}
