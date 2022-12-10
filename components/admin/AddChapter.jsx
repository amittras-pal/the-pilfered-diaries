import { SITE_URL } from "@constants/app";
import { storage, store } from "@fb/client";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import styles from "../../styles/modules/Admin.module.scss";

export default function AddChapter({ onCompleted }) {
  const fileInput = useRef();
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    watch,
  } = useForm({
    mode: "onBlur",
    shouldFocusError: true,
    defaultValues: {
      author: "Amittras",
      excerpt: "",
      chapterId: "",
      order: 1,
      previousChapter: "",
      nextChapter: "",
      title: "",
      file: null,
      markCompleted: false,
      refreshPassword: "",
    },
    resolver: yupResolver(
      yup.object().shape({
        title: yup.string().required("Title is required"),
        author: yup.string().required("Author is required"),
        excerpt: yup.string().required("Excerpt is required"),
        refreshPassword: yup.string().required("Refresh Password is required."),
        chapterId: yup
          .string()
          .required("Chapter ID is required")
          .matches(/^\S*$/, { message: "Chapter ID must not have spaces." }),
        previousChapter: yup.string().test({
          name: "previousChapter",
          message:
            "Previous Chapter is required when it's not the first chapter.",
          test: (value, ctx) => {
            if (ctx.parent.order > 1 && !value) return false;
            return true;
          },
        }),
        order: yup.number().test({
          name: "orderCounter",
          message: "Order must follow the sequence in the story.",
          test: (value) => {
            if (value !== selectedStory?.chapterSlugs?.length + 1) return false;
            return true;
          },
        }),
        file: yup
          .mixed()
          .required("Content file is required")
          .test({
            name: "fileType",
            message: "Invalid File Type",
            test: (value) => {
              if (!value) return false;
              if (!value.name?.endsWith(".mdx")) return false;
              return true;
            },
          }),
      })
    ),
  });

  const [processing, setProcessing] = useState("");
  const [wipStories, setWipStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  useEffect(() => {
    (async () => {
      const q = query(collection(store, "stories"), where("wip", "==", true));
      const response = await getDocs(q);
      setWipStories(
        response.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    })();
  }, []);

  useEffect(() => {
    if (selectedStory) {
      setValue("order", selectedStory?.chapterSlugs.length + 1);
      if (selectedStory?.chapterSlugs.length > 0)
        setValue("previousChapter", selectedStory?.chapterSlugs.at(-1));
    }
  }, [selectedStory, setValue]);

  const refreshPages = async ({ refreshPassword }) => {
    setProcessing("Refreshing Story...");
    try {
      await axios.post("/api/revalidate", {
        pwd: refreshPassword,
        updateType: [`stories/${selectedStory.id}`],
      });
      setProcessing("Processing Completed.");
      setTimeout(() => {
        reset();
        onCompleted();
      }, 500);
    } catch (error) {
      console.error(error);
    }
  };

  const addChapterDoc = async (snapshotRef, values) => {
    setProcessing("Creating Chapter...");
    try {
      const fileUrl = await getDownloadURL(snapshotRef);
      const chapter = {
        author: values.author,
        excerpt: values.excerpt,
        order: values.order,
        previousChapter: values.previousChapter,
        nextChapter: values.nextChapter,
        title: values.title,
        content: fileUrl,
      };
      await setDoc(
        doc(store, "stories", selectedStory.id, "chapters", values.chapterId),
        chapter
      );
      setProcessing("Updating Story Info...");
      const storyUpdatePayload = {
        lastUpdated: Timestamp.fromDate(new Date()),
        chapterSlugs: [...selectedStory.chapterSlugs, values.chapterId],
        wip: !values.markCompleted,
      };
      const storyRef = doc(store, "stories", selectedStory.id);
      await setDoc(storyRef, storyUpdatePayload, { merge: true });
      setProcessing("Story Updated");
      refreshPages(values);
    } catch (error) {
      console.error(error);
    }
  };

  const addChapter = async (values) => {
    setProcessing("Uploading File...");
    const storageRef = ref(
      storage,
      `/stories/${selectedStory.id}/${values.file.name}`
    );
    const uploadTask = uploadBytesResumable(storageRef, values.file);

    // start upload.
    uploadTask.on(
      "state_changed",
      (snap) => {
        const progress =
          Math.round(snap.bytesTransferred / snap.totalBytes) * 100;
        setProcessing(`Uploading File...${progress}%`);
      },
      (err) => {
        console.error(err);
        setProcessing("");
      },
      () => {
        addChapterDoc(uploadTask.snapshot.ref, values);
      }
    );
  };

  return (
    <div className={`${styles.chapter} p-3`}>
      <div className="row mb-3">
        <div className="col-md-4">
          <select
            className="form-select form-select-sm"
            aria-label="Default select example"
            onChange={(e) =>
              setSelectedStory(
                wipStories.find((s) => s.title === e.target.value)
              )
            }
            disabled={!!selectedStory}
            value={selectedStory?.title ?? ""}
          >
            <option>Select a WIP Story</option>
            {wipStories.map((s) => (
              <option value={s.title} key={s.title}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4" />
        <div className="col-md-4 d-flex justify-content-end">
          {selectedStory && (
            <button
              className="btn btn-sm btn-danger"
              disabled={processing}
              onClick={() => {
                setSelectedStory("");
                reset();
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
      {selectedStory && (
        <form className="row" onSubmit={handleSubmit(addChapter)}>
          <div className="col-md-6 mb-3">
            <div className="form-floating">
              <input
                type="text"
                {...register("title")}
                className={`form-control form-control-sm ${
                  errors.title ? "is-invalid" : ""
                }`}
                placeholder="Chapter Title *"
                autoFocus
                readOnly={processing}
              />
              <label>Chapter Title *</label>
              {errors.title && (
                <div className="invalid-feedback">{errors.title.message}</div>
              )}
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="form-floating">
              <input
                type="text"
                {...register("author")}
                className={`form-control form-control-sm ${
                  errors.author ? "is-invalid" : ""
                }`}
                placeholder="Author Name"
                readOnly={processing}
              />
              <label>Author Name</label>
              {errors.author && (
                <div className="invalid-feedback">{errors.author.message}</div>
              )}
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="form-floating">
              <input
                type="text"
                readOnly
                {...register("previousChapter")}
                className={`form-control form-control-sm ${
                  errors.previousChapter ? "is-invalid" : ""
                }`}
                placeholder="Previous Chapter"
              />
              <label>Previous Chapter</label>
              {errors.previousChapter && (
                <div className="invalid-feedback">
                  {errors.previousChapter.message}
                </div>
              )}
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="form-floating">
              <input
                type="text"
                {...register("chapterId")}
                className={`form-control form-control-sm ${
                  errors.chapterId ? "is-invalid" : ""
                }`}
                placeholder="Chapter ID"
                readOnly={processing}
              />
              <label>Chapter ID</label>
              {errors.chapterId && (
                <div className="invalid-feedback">
                  {errors.chapterId.message}
                </div>
              )}
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="form-floating">
              <input
                type="number"
                readOnly
                {...register("order")}
                className={`form-control form-control-sm ${
                  errors.order ? "is-invalid" : ""
                }`}
                placeholder="Chapter Order"
              />
              <label>Chapter Order</label>
              {errors.order && (
                <div className="invalid-feedback">{errors.order.message}</div>
              )}
            </div>
            <label
              className="d-flex align-items-center mt-3 mb-2"
              style={{ width: "fit-content" }}
            >
              <input
                className="form-check-input"
                type="checkbox"
                {...register("markCompleted")}
              />
              <span className="ms-2">Mark Story as Completed.</span>
            </label>
            {watch("markCompleted") && (
              <p className="small text-success mb-2">
                New chapters cannot be added once a story is marked
                &lsquo;completed&rsquo;.
              </p>
            )}
            <div className="form-floating">
              <input
                type="password"
                {...register("refreshPassword")}
                className={`form-control form-control-sm ${
                  errors.refreshPassword ? "is-invalid" : ""
                }`}
                placeholder="Refresh Password"
              />
              <label>Refresh Password</label>
              {errors.refreshPassword && (
                <div className="invalid-feedback">
                  {errors.refreshPassword.message}
                </div>
              )}
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="form-floating">
              <textarea
                className={`form-control ${errors.excerpt ? "is-invalid" : ""}`}
                {...register("excerpt")}
                placeholder="Chapter Excerpt"
                style={{ height: "165px" }}
                readOnly={processing}
              ></textarea>
              <label>Chapter Excerpt</label>
              {errors.excerpt && (
                <div className="invalid-feedback">{errors.excerpt.message}</div>
              )}
            </div>
          </div>
          <div className="col-md-12 mb-3">
            <div
              className={`${styles.chapter__file_input} ${
                errors.file?.message ? styles.chapter__file_input_invalid : ""
              }`}
              onClick={() => {
                if (!processing) fileInput.current.click();
              }}
            >
              <p className="mb-1">Add Content File</p>
              <p className="small mb-0 text-muted">
                Only .MDX files supported.
              </p>
              <input
                type="file"
                {...register("file")}
                onChange={(e) => {
                  setValue("file", e.target.files[0], {
                    shouldValidate: true,
                    shouldTouch: true,
                    shouldDirty: true,
                  });
                }}
                ref={fileInput}
              />
              {errors.file && (
                <p className="small text-danger mb-0">{errors.file.message}</p>
              )}
            </div>
          </div>
          <div className="col-md-4 offset-md-4 d-flex justify-content-center">
            <button
              type="submit"
              className="btn btn-sm btn-success"
              disabled={processing}
            >
              {processing || "Upload Chapter"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
