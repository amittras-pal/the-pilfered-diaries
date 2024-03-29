"use client";

import Login from "@components/client/admin/Login";
import { auth } from "@firebase/client.config";
import { onAuthStateChanged } from "firebase/auth";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const loading = () => (
  <p className="text-xs font-thin my-3">Loading Module...</p>
);

const AdminLayout = dynamic(
  () => import("../../components/client/admin/AdminLayout"),
  { ssr: false, loading }
);
const Comments = dynamic(
  () => import("../../components/client/admin/Comments"),
  { ssr: false, loading }
);
const Home = dynamic(() => import("../../components/client/admin/Home"), {
  ssr: false,
  loading,
});
const NewChapter = dynamic(
  () => import("../../components/client/admin/NewChapter"),
  { ssr: false, loading }
);
const NewPost = dynamic(() => import("../../components/client/admin/NewPost"), {
  ssr: false,
  loading,
});
const NewStory = dynamic(
  () => import("../../components/client/admin/NewStory"),
  { ssr: false, loading }
);
const FilePreview = dynamic(
  () => import("../../components/client/admin/FilePreview"),
  { ssr: false, loading }
);

const Admin = () => {
  const [userType, setUserType] = useState<"admin" | "other" | "none">("none");
  const [activeModule, setactiveModule] = useState("login");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserType(
          user.uid === process.env.NEXT_PUBLIC_ADMIN_ID ? "admin" : "other"
        );
        setactiveModule("home");
      } else setUserType("none");
    });
    return unsubscribe;
  }, []);

  if (["other", "none"].includes(userType))
    return <Login prohibited={userType === "other"} />;

  return (
    <AdminLayout active={activeModule} onChange={setactiveModule}>
      {activeModule === "home" && <Home />}
      {activeModule === "comments" && <Comments />}
      {activeModule === "post" && <NewPost />}
      {activeModule === "story" && <NewStory />}
      {activeModule === "chapter" && <NewChapter />}
      {activeModule === "file" && <FilePreview />}
    </AdminLayout>
  );
};

export default Admin;
