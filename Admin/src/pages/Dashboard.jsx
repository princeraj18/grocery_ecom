import { useEffect, useState } from "react";
import api from "../services/api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function Dashboard() {
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await api.get("/analytics");
        setAnalytics(data.analytics);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const dashboardStats = [
    { title: "Users", value: analytics.totalUsers },
    { title: "Vendors", value: analytics.totalVendors },
    { title: "Products", value: analytics.totalProducts },
    { title: "Orders", value: analytics.totalOrders },
    { title: "Revenue", value: `₹${analytics.totalRevenue}` },
  ];

  const barData = [
    { name: "Users", value: analytics.totalUsers },
    { name: "Vendors", value: analytics.totalVendors },
    { name: "Products", value: analytics.totalProducts },
    { name: "Orders", value: analytics.totalOrders },
  ];

  const pieData = [
    { name: "Revenue", value: analytics.totalRevenue },
    { name: "Orders", value: analytics.totalOrders },
    { name: "Products", value: analytics.totalProducts },
  ];

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
  ];

  return (
    <div className="p-4 md:p-6">

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Admin Analytics Overview
        </p>
      </div>

      {loading ? (
        <div className="text-center text-xl font-semibold">
          Loading Dashboard...
        </div>
      ) : (
        <>
          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">

            {dashboardStats.map((item, index) => (
              <div
                key={index}
                className="bg-white p-5 rounded-2xl shadow"
              >
                <h2 className="text-gray-500">
                  {item.title}
                </h2>

                <p className="text-2xl md:text-4xl font-bold mt-2">
                  {item.value}
                </p>
              </div>
            ))}

          </div>

          {/* CHARTS */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            <div className="bg-white rounded-2xl shadow p-4 md:p-6">

              <h2 className="text-xl font-bold mb-4">
                Platform Overview
              </h2>

              <ResponsiveContainer
                width="100%"
                height={300}
              >
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />

                  <Bar
                    dataKey="value"
                    fill="#000000"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>

            </div>

            <div className="bg-white rounded-2xl shadow p-4 md:p-6">

              <h2 className="text-xl font-bold mb-4">
                Revenue Analytics
              </h2>

              <ResponsiveContainer
                width="100%"
                height={300}
              >
                <PieChart>

                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label
                  >
                    {pieData.map(
                      (entry, index) => (
                        <Cell
                          key={index}
                          fill={
                            COLORS[
                              index %
                                COLORS.length
                            ]
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip />
                  <Legend />

                </PieChart>
              </ResponsiveContainer>

            </div>

          </div>
        </>
      )}
    </div>
  );
}