import React from "react";

export default function StatCard({
  title,
  value,
}) {

  return (

    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-gray-500 text-lg">
        {title}
      </h2>

      <p className="text-3xl font-bold mt-3">
        {value}
      </p>

    </div>
  );
}