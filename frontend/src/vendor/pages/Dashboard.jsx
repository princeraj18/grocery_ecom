import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import Sidebar from "../components/Sidebar";

import Navbar from "../components/Navbar";

import StatCard from "../components/StatCard";
import api from "../api/api";

export default function Dashboard() {

  const [stats, setStats] =
    useState({
      totalSales: 0,
      totalOrders: 0,
      totalProducts: 0,
      totalCustomers: 0,
      totalReviews: 0,
    });

  useEffect(() => {

    fetchDashboard();

  }, []);

  const fetchDashboard =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "vendorToken"
          );

        const { data } =
          await api.get(
            "/dashboard/stats",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setStats(data.stats);

      } catch (error) {

        console.log(error);
      }
    };

  return (

    <div className="flex">

      <Sidebar />

      <div className="flex-1 bg-gray-100 dark:bg-slate-950 min-h-screen">

        <Navbar />

        <div className="p-6">

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

            <StatCard
              title="Total Sales"
              value={`₹${stats.totalSales}`}
            />

            <StatCard
              title="Orders"
              value={stats.totalOrders}
            />

            <StatCard
              title="Products"
              value={stats.totalProducts}
            />

            <StatCard
              title="Customers"
              value={stats.totalCustomers}
            />

            <StatCard
              title="Reviews"
              value={stats.totalReviews}
            />

          </div>

        </div>

      </div>

    </div>
  );
}