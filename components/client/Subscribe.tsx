"use client";

import { IconX } from "@tabler/icons-react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { SITE_TITLE } from "../../constants/app";
import { auth } from "../../firebase/client.config";
import Divider from "../Divider";
import SubscriptionForm from "../aside-cta/SubscriptionForm";

// TODO: run console cleanup.
export default function Subscribe() {
  const { asPath } = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);

  // TODO: Need to configure so that after closing this, it doesn't irritate the user again.
  useEffect(() => {
    let timer: any;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user && asPath !== "/admin") {
        console.log("timer started");
        // TODO: set an appropriate timeout.
        timer = setTimeout(() => dialog.current?.showModal(), 5000);
      } else {
        dialog.current?.close();
        clearTimeout(timer);
      }
    });

    return () => {
      console.log("timer stopped");

      clearTimeout(timer);
      unsubscribe();
    };
  }, [asPath]);

  return (
    <dialog className="modal" ref={dialog}>
      <div className="modal-box">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl text-white">Subscribe to {SITE_TITLE}</h2>
          <button
            className="btn btn-sm"
            onClick={() => dialog.current?.close()}
          >
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
