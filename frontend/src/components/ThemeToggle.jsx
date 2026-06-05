import {
  FaMoon,
  FaSun,
} from "react-icons/fa";
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
      className="flex h-10 w-10 items-center justify-center rounded border border-slate-200 hover:bg-gray-100 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
    >
      {dark ? <FaSun /> : <FaMoon />}
    </button>
  );
}
