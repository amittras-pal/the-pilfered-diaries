"use client";

import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Analytics() {
  const { asPath } = useRouter();
  useEffect(() => {
    console.log("Will Log Page View Here!");
    // TODO: activate analytics.
    // const analytics = getAnalytics(app);
    // logEvent(analytics, "page_view");
  }, [asPath]);
  return null;
}
