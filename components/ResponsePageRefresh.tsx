"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const refreshIntervalMs = 5 * 60 * 1000;

export default function ResponsePageRefresh() {
  const router = useRouter();

  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === "visible") router.refresh();
    };

    const interval = window.setInterval(refresh, refreshIntervalMs);
    document.addEventListener("visibilitychange", refresh);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [router]);

  return null;
}
