"use client";

import { IconX } from "@tabler/icons-react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { SITE_TITLE } from "../../constants/app";
import { auth } from "../../firebase/client.config";
import Divider from "../Divider";
import SubscriptionForm from "../aside-cta/SubscriptionForm";

export default function SubscribeModal() {
  const { asPath } = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);

  const [rejectedSubscribe, setRejectedSubscribe] = useState(false);
  useEffect(() => {
    const handler = () => {
      setRejectedSubscribe(
        JSON.parse(sessionStorage.getItem("rejected") ?? "false")
      );
    };

    handler();
    window.addEventListener("subscriber", handler);
    return () => window.removeEventListener("subscriber", handler);
  }, []);

  useEffect(() => {
    let timer: any;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!rejectedSubscribe && !user && asPath !== "/admin") {
        timer = setTimeout(() => dialog.current?.showModal(), 15000);
      } else {
        dialog.current?.close();
        clearTimeout(timer);
      }
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [asPath, rejectedSubscribe]);

  const handleClose = () => {
    dialog.current?.close();
    sessionStorage.setItem("rejected", "true");
    window.dispatchEvent(new Event("subscriber"));
  };

  return (
    <dialog className="modal" ref={dialog}>
      <div className="modal-box">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl text-white">Subscribe to {SITE_TITLE}</h2>
          <button className="btn btn-sm" onClick={handleClose}>
            <IconX size={14} />
          </button>
        </div>
        <Divider direction="horizontal" className="my-4" />
        <p className="text-gray-300 font-body">
          Subscribe to {SITE_TITLE} newsletter, and receive a monthly digest of
          all new posts & stories, straight to your inbox...
        </p>
        <div className="flex justify-center mt-3">
          <SubscriptionForm inModal />
        </div>
      </div>
    </dialog>
  );
}
