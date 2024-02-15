"use client";

import { app } from "@firebase/client.config";
import { getAnalytics, logEvent } from "firebase/analytics";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Analytics() {
  const { asPath } = useRouter();

  useEffect(() => {
    const analytics = getAnalytics(app);
    if (asPath !== "/admin") logEvent(analytics, "page_view");
  }, [asPath]);

  return null;
}
