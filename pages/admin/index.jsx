import { auth } from "@fb/client";
import { signOut } from "firebase/auth";
import React, { Suspense, useState } from "react";
import { lazy } from "react";
import AuthProvider from "../../context/Auth";
import styles from "../../styles/modules/Admin.module.scss";

const AddChapter = lazy(() => import("../../components/admin/AddChapter"));
const AddPost = lazy(() => import("../../components/admin/AddPost"));
const AddStory = lazy(() => import("../../components/admin/AddStory"));
const Comments = lazy(() => import("../../components/admin/Comments"));
const FilePreview = lazy(() => import("../../components/admin/FilePreview"));
const Submissions = lazy(() => import("../../components/admin/Submissions"));

export default function Admin() {
  const [active, setActive] = useState("add-post");

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthProvider>
      <div className={styles.wrapper}>
        <div className={`w-25 ${styles.sidebar}`}>
          <button
            className={`${styles.nav} ${
              active === "add-post" ? styles.nav__active : ""
            }`}
            onClick={() => setActive("add-post")}
          >
            Add New Post
          </button>
          <button
            className={`${styles.nav} ${
              active === "add-story" ? styles.nav__active : ""
            }`}
            onClick={() => setActive("add-story")}
          >
            Add New Story
          </button>
          <button
            className={`${styles.nav} ${
              active === "add-chapter" ? styles.nav__active : ""
            }`}
            onClick={() => setActive("add-chapter")}
          >
            Add Chapter to an Ongoing Story
          </button>
          <button
            className={`${styles.nav} ${
              active === "comments" ? styles.nav__active : ""
            }`}
            onClick={() => setActive("comments")}
          >
            Approve Comments
          </button>
          <button
            className={`${styles.nav} ${
              active === "submissions" ? styles.nav__active : ""
            }`}
            onClick={() => setActive("submissions")}
            disabled
          >
            Review Submissions
          </button>
          <button
            className={`${styles.nav} ${
              active === "preview" ? styles.nav__active : ""
            }`}
            onClick={() => setActive("preview")}
          >
            File Preview
          </button>
          <button
            className={`mt-auto ${styles.nav}  bg-danger`}
            onClick={logout}
          >
            Sign Out
          </button>
        </div>
        <div className={`w-75 ${styles.content}`} id="prContent">
          <Suspense fallback="Loading Module">
            {active === "comments" && <Comments />}
            {active === "submissions" && <Submissions />}
            {active === "preview" && <FilePreview />}
            {active === "add-chapter" && (
              <AddChapter onCompleted={() => setActive("")} />
            )}
            {active === "add-story" && (
              <AddStory onCompleted={() => setActive("")} />
            )}
            {active === "add-post" && (
              <AddPost onCompleted={() => setActive("")} />
            )}
          </Suspense>
        </div>
      </div>
    </AuthProvider>
  );
}
