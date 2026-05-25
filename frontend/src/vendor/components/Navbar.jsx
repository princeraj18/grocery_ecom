import React from "react";

export default function Navbar() {

  return (
    <div className="bg-white shadow px-6 py-4 flex items-center justify-between">

      <h1 className="text-2xl font-bold">
        Vendor Dashboard
      </h1>

      <div className="flex items-center gap-4">

        <img
          src="https://i.pravatar.cc/40"
          alt=""
          className="w-10 h-10 rounded-full"
        />

      </div>

    </div>
  );
}