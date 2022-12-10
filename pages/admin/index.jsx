import { signOut } from "firebase/auth";
import React, { useState } from "react";
import styles from "../../styles/modules/Admin.module.scss";
import AuthProvider from "../../context/Auth";
import { auth } from "@fb/client";
import Comments from "@components/admin/Comments";
import Submissions from "@components/admin/Submissions";
import FilePreview from "@components/admin/FilePreview";
import AddChapter from "@components/admin/AddChapter";

export default function Admin() {
  const [active, setActive] = useState("");

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthProvider>
      <div className={styles.wrapper}>
        <div className={`w-25 ${styles.sidebar}`}>
          <button
            className={`${styles.nav} ${
              active === "story" ? styles.nav__active : ""
            }`}
            onClick={() => setActive("story")}
            disabled
          >
            Add New Story
          </button>
          <button
            className={`${styles.nav} ${
              active === "add-chapter" ? styles.nav__active : ""
            }`}
            onClick={() => setActive("add-chapter")}
          >
            Add Chapter to WIP Story
          </button>
          <button
            className={`${styles.nav} ${
              active === "post" ? styles.nav__active : ""
            }`}
            onClick={() => setActive("post")}
            disabled
          >
            Add New Post
          </button>
          <button
            className={`${styles.nav} ${
              active === "comments" ? styles.nav__active : ""
            }`}
            onClick={() => setActive("comments")}
            disabled
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
          {active === "comments" && <Comments />}
          {active === "submissions" && <Submissions />}
          {active === "preview" && <FilePreview />}
          {active === "add-chapter" && (
            <AddChapter onCompleted={() => setActive("")} />
          )}
        </div>
      </div>
    </AuthProvider>
  );
}
