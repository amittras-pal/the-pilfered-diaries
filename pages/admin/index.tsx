"use client";

import Login from "@components/client/admin/Login";
import { auth } from "@firebase/client.config";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
// TODO: Import Lazy
import AdminLayout from "../../components/client/admin/AdminLayout";
import Comments from "../../components/client/admin/Comments";
import Home from "../../components/client/admin/Home";
import Post from "../../components/client/admin/Post";

const Admin = () => {
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [activeModule, setactiveModule] = useState("login");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // TODO: Validate this.
        setAdminAuthenticated(user.uid === process.env.NEXT_PUBLIC_ADMIN_ID);
        setactiveModule("home");
      } else setAdminAuthenticated(true);
    });
    return unsubscribe;
  }, []);

  return (
    <>
      {activeModule === "login" ? (
        <Login prohibited={!adminAuthenticated} />
      ) : (
        <AdminLayout active={activeModule} onChange={setactiveModule}>
          {activeModule === "home" && <Home />}
          {activeModule === "comments" && <Comments />}
          {activeModule === "post" && <Post />}
        </AdminLayout>
      )}
    </>
  );
};

export default Admin;
