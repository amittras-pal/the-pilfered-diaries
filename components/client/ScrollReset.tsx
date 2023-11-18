"use client";

import { useRouter } from "next/router";
import { useEffect } from "react";

export default function ScrollReset() {
  const { asPath } = useRouter();

  useEffect(() => {
    // Scroll to top of content
    document.getElementById("main")?.scrollTo({ top: 0, behavior: "smooth" });
    // Defocus any active element; Also closes the menu!
    (document.activeElement as HTMLButtonElement)?.blur();
  }, [asPath]);

  return null;
}
