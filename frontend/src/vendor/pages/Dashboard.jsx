import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";

export default function Dashboard() {

  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">

        <Navbar />

        <div className="p-6">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            <StatCard
              title="Total Sales"
              value="₹50,000"
            />

            <StatCard
              title="Orders"
              value="120"
            />

            <StatCard
              title="Products"
              value="45"
            />

            <StatCard
              title="Customers"
              value="320"
            />

          </div>

        </div>

      </div>

    </div>
  );
}