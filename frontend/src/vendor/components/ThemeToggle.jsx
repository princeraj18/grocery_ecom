import { Moon, Sun } from "lucide-react";
import { useLayoutEffect, useState } from "react";
import { applyTheme, getInitialDark } from "../../utils/theme";

export default function ThemeToggle({ className = "" }) {
  const [dark, setDark] = useState(getInitialDark);

  useLayoutEffect(() => {
    applyTheme(dark);
  }, [dark]);

  return (
    <button
      type="button"
      onClick={() => setDark((value) => !value)}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800 ${className}`}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
