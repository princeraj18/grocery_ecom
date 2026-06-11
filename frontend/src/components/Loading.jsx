import React from "react";

function Loading() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-100 dark:bg-slate-950">

      {/* Spinner */}
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>

      {/* Text */}
      <h2 className="mt-4 text-xl font-semibold text-gray-700 dark:text-slate-300">
        Loading...
      </h2>

      <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">
        Please wait while we prepare your experience
      </p>

    </div>
  );
}

export default Loading;