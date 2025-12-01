"use client";

import { useEffect } from "react";
import { useServerStore } from "@/store/serverStore";

export default function ServerPoller() {
  const fetchStatus = useServerStore((state) => state.fetchStatus);

  useEffect(() => {
    // Pierwsze pobranie od razu
    fetchStatus(true);

    const interval = setInterval(() => {
      fetchStatus(true); // skip loading
    }, 1000);

    return () => clearInterval(interval);
  }, [fetchStatus]);

  return null; // komponent tylko do pollingu
}
