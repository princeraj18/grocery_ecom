import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Orders() {

  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">

        <Navbar />

        <div className="p-6">

          <h1 className="text-3xl font-bold">
            Orders
          </h1>

        </div>

      </div>

    </div>
  );
}