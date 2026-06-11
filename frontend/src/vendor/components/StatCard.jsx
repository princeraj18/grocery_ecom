import React from "react";

export default function StatCard({
  title,
  value,
}) {

  return (

    <div className="panel-surface p-6">

      <h2 className="text-gray-500 dark:text-slate-400 text-lg">
        {title}
      </h2>

      <p className="text-3xl font-bold mt-3 text-slate-900 dark:text-white">
        {value}
      </p>

    </div>
  );
}
