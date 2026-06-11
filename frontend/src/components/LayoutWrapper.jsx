import React from "react";

export default function LayoutWrapper({ children }) {
  return (
    <div className="min-h-screen bg-[#f6f7f1] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {children}
    </div>
  );
}
