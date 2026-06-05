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
      className="inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-300 hover:bg-slate-800 hover:text-white"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
