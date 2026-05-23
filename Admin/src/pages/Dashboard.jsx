import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import api from "../services/api";

export default function Dashboard() {

  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  });

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const fetchDashboardData =
      async () => {

        try {

          // fetch all data together
          const [
            usersRes,
            productsRes,
            ordersRes,
          ] = await Promise.all([
            api.get("/admin/users"),
            api.get("/products"),
            api.get("/orders"),
          ]);

          const users =
            usersRes.data.users || [];

          const products =
            productsRes.data.products || [];

          const orders =
            ordersRes.data.orders || [];

          // calculate revenue
          const revenue =
            orders.reduce(
              (total, order) =>
                total +
                (order.totalPrice || 0),
              0
            );

          setStats({
            users: users.length,
            products: products.length,
            orders: orders.length,
            revenue,
          });

        } catch (error) {

          console.log(error);

        } finally {

          setLoading(false);

        }
      };

    fetchDashboardData();

  }, []);

  const dashboardStats = [
    {
      title: "Users",
      value: stats.users,
    },
    {
      title: "Products",
      value: stats.products,
    },
    {
      title: "Orders",
      value: stats.orders,
    },
    {
      title: "Revenue",
      value: `₹${stats.revenue}`,
    },
  ];

  return (
    <AdminLayout>

      <div className="flex items-center justify-between mb-8">

        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-gray-500">
          Admin Overview
        </p>

      </div>

      {
        loading ? (

          <div className="text-center text-lg">
            Loading dashboard...
          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

            {
              dashboardStats.map(
                (item, index) => (

                  <div
                    key={index}
                    className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
                  >

                    <h2 className="text-gray-500 text-lg">
                      {item.title}
                    </h2>

                    <p className="text-4xl font-bold mt-3">
                      {item.value}
                    </p>

                  </div>
                )
              )
            }

          </div>
        )
      }

    </AdminLayout>
  );
}