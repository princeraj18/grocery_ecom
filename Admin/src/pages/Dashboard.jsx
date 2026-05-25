import {
  useEffect,
  useState,
} from "react";

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

  const [analytics, setAnalytics] =
    useState({
      totalUsers: 0,
      totalVendors: 0,
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
    });

  const [loading, setLoading] =
    useState(true);

  // ======================================
  // FETCH ANALYTICS
  // ======================================
  useEffect(() => {

    const fetchAnalytics =
      async () => {

        try {

          const { data } =
            await api.get(
              "/analytics"
            );

          setAnalytics(
            data.analytics
          );

        } catch (error) {

          console.log(error);

        } finally {

          setLoading(false);
        }
      };

    fetchAnalytics();

  }, []);

  // ======================================
  // STATS CARDS
  // ======================================
  const dashboardStats = [
    {
      title: "Users",
      value:
        analytics.totalUsers,
    },

    {
      title: "Vendors",
      value:
        analytics.totalVendors,
    },

    {
      title: "Products",
      value:
        analytics.totalProducts,
    },

    {
      title: "Orders",
      value:
        analytics.totalOrders,
    },

    {
      title: "Revenue",
      value: `₹${analytics.totalRevenue}`,
    },
  ];

  // ======================================
  // BAR CHART DATA
  // ======================================
  const barData = [
    {
      name: "Users",
      value:
        analytics.totalUsers,
    },

    {
      name: "Vendors",
      value:
        analytics.totalVendors,
    },

    {
      name: "Products",
      value:
        analytics.totalProducts,
    },

    {
      name: "Orders",
      value:
        analytics.totalOrders,
    },
  ];

  // ======================================
  // PIE CHART DATA
  // ======================================
  const pieData = [
    {
      name: "Revenue",
      value:
        analytics.totalRevenue,
    },

    {
      name: "Orders",
      value:
        analytics.totalOrders,
    },

    {
      name: "Products",
      value:
        analytics.totalProducts,
    },
  ];

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
  ];

  return (

    <div className="p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-3xl font-bold">
            Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Admin Analytics Overview
          </p>

        </div>

      </div>

      {/* LOADING */}
      {
        loading ? (

          <div className="text-center text-xl font-semibold">
            Loading Dashboard...
          </div>

        ) : (

          <>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">

              {
                dashboardStats.map(
                  (
                    item,
                    index
                  ) => (

                    <div
                      key={index}
                      className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
                    >

                      <h2 className="text-gray-500 text-lg">
                        {
                          item.title
                        }
                      </h2>

                      <p className="text-4xl font-bold mt-3">
                        {
                          item.value
                        }
                      </p>

                    </div>
                  )
                )
              }

            </div>

            {/* CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* BAR CHART */}
              <div className="bg-white rounded-2xl shadow p-6">

                <h2 className="text-2xl font-bold mb-6">
                  Platform Overview
                </h2>

                <ResponsiveContainer
                  width="100%"
                  height={350}
                >

                  <BarChart
                    data={barData}
                  >

                    <XAxis
                      dataKey="name"
                    />

                    <YAxis />

                    <Tooltip />

                    <Bar
                      dataKey="value"
                      fill="#000000"
                      radius={[
                        10,
                        10,
                        0,
                        0,
                      ]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

              {/* PIE CHART */}
              <div className="bg-white rounded-2xl shadow p-6">

                <h2 className="text-2xl font-bold mb-6">
                  Revenue Analytics
                </h2>

                <ResponsiveContainer
                  width="100%"
                  height={350}
                >

                  <PieChart>

                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      dataKey="value"
                      label
                    >

                      {
                        pieData.map(
                          (
                            entry,
                            index
                          ) => (

                            <Cell
                              key={`cell-${index}`}
                              fill={
                                COLORS[
                                  index %
                                    COLORS.length
                                ]
                              }
                            />
                          )
                        )
                      }

                    </Pie>

                    <Tooltip />

                    <Legend />

                  </PieChart>

                </ResponsiveContainer>

              </div>

            </div>

          </>
        )
      }

    </div>
  );
}