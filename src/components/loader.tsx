"use client";

import { useEffect, useState } from "react";

export function Loader() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("nk_intro_seen")) return;
    sessionStorage.setItem("nk_intro_seen", "1");
    setVisible(true);
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
    }, 1000);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-base">
      <span className="animate-pulse font-display text-[13px] uppercase tracking-cinematic text-boneDim">
        Nobody Knows
      </span>
    </div>
  );
}
