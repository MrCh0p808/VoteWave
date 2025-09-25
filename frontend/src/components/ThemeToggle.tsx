import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState<boolean>(() => {
    try {
      const val = localStorage.getItem("votewave_theme");
      if (val) return val === "dark";
      // init from system
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("votewave_theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("votewave_theme", "light");
    }
  }, [dark]);

  return (
    <button
      aria-label="toggle theme"
      onClick={() => setDark((d) => !d)}
      className="p-2 rounded-md hover:bg-surface/60"
      title="Toggle theme"
    >
      {dark ? <Sun className="w-5 h-5 text-primary" /> : <Moon className="w-5 h-5 text-textSecondary" />}
    </button>
  );
}
