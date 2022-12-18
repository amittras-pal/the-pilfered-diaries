import { APP_TITLE } from "@constants/app";
import { useSubscription } from "@context/Subscription";
import { IconCircleCheck, IconUserPlus } from "@tabler/icons";
import React from "react";
import styles from "../styles/modules/Subscribe.module.scss";
import Alert from "./Alert";

export default function Subscribe() {
  const { subscribed, showForm } = useSubscription();

  return subscribed ? (
    <Alert variant="info">
      <span className="me-2">
        <IconCircleCheck size={24} />
      </span>
      <span className="mb-0">Your email </span>
      <span className="fw-bold mb-0">&lsquo;{subscribed}&rsquo; </span>
      <span className="mb-0"> is subscribed to {APP_TITLE}</span>
    </Alert>
  ) : (
    <div className={styles.sub}>
      <button
        className="btn btn-lg btn-primary shadow icon-right w-100 icon-right"
        onClick={showForm}
      >
        Subscribe to the newsletter
        <IconUserPlus size={20} />
      </button>
    </div>
  );
}
