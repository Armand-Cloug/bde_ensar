// src/components/PingHousekeeping.tsx
'use client';

import { useEffect } from "react";

export default function PingHousekeeping() {
  useEffect(() => {
    const key = "hk-last";
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const last = localStorage.getItem(key);
    if (last === today) return;

    fetch("/api/_housekeeping", { cache: "no-store" }).finally(() => {
      localStorage.setItem(key, today);
    });
  }, []);
  return null;
}
