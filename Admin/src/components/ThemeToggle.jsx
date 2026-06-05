import {
  Moon,
  Sun,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

export default function ThemeToggle() {
  const [dark, setDark] =
    useState(
      () =>
        localStorage.getItem("theme") ===
        "dark"
    );

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      dark
    );
    localStorage.setItem(
      "theme",
      dark ? "dark" : "light"
    );
  }, [dark]);

  return (
    <button
      type="button"
      onClick={() => setDark((value) => !value)}
      title="Change theme"
      className="inline-flex h-10 w-10 items-center justify-center rounded border border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
