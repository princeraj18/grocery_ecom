import React, {
  useEffect,
  useState,
} from "react";

import {
  Bike,
  CheckCircle,
  IndianRupee,
  Package,
  Truck,
  UserCheck,
  Users,
  UserX,
  Wallet,
} from "lucide-react";

import api from "../services/api";

const money = (value = 0) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function DeliveryDashboard() {

  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard =
    async () => {

      try {

        setLoading(true);

        const res =
          await api.get(
            "/admin/delivery-dashboard"
          );

        if (
          res.data.success
        ) {

          setData(
            res.data.dashboard
          );
        }

      } catch (error) {

        console.log(error);

        setError(
          error.response?.data
            ?.message ||
            "Failed to fetch dashboard"
        );

      } finally {

        setLoading(false);
      }
    };

  if (loading) {

    return (
      <div className="p-6 text-xl">
        Loading dashboard...
      </div>
    );
  }

  return (

    <div className="space-y-6 p-6">

      {/* HEADER */}
      <div>

        <h1 className="text-3xl font-bold">
          Delivery Dashboard
        </h1>

        <p className="text-slate-500 mt-1">
          Manage delivery partners and deliveries
        </p>

      </div>

      {/* ERROR */}
      {error && (

        <div className="bg-red-100 text-red-600 p-4 rounded-lg">
          {error}
        </div>

      )}

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        {/* TOTAL PARTNERS */}
        <StatCard
          label="Total Partners"
          value={
            data?.totalPartners || 0
          }
          icon={
            <Users className="text-blue-500" />
          }
        />

        {/* AVAILABLE */}
        <StatCard
          label="Available Partners"
          value={
            data?.availablePartners || 0
          }
          icon={
            <UserCheck className="text-emerald-500" />
          }
        />

        {/* BUSY */}
        <StatCard
          label="Busy Partners"
          value={
            data?.busyPartners || 0
          }
          icon={
            <UserX className="text-red-500" />
          }
        />

        {/* TOTAL EARNINGS */}
        <StatCard
          label="Total Earnings"
          value={money(
            data?.totalEarnings
          )}
          icon={
            <IndianRupee className="text-yellow-500" />
          }
        />

        {/* WALLET */}
        <StatCard
          label="Wallet Balance"
          value={money(
            data?.walletBalance
          )}
          icon={
            <Wallet className="text-cyan-500" />
          }
        />

        {/* WITHDRAWN */}
        <StatCard
          label="Withdrawn Amount"
          value={money(
            data?.withdrawnAmount
          )}
          icon={
            <Wallet className="text-violet-500" />
          }
        />

        {/* ACTIVE DELIVERIES */}
        <StatCard
          label="Active Deliveries"
          value={
            data?.activeDeliveries || 0
          }
          icon={
            <Bike className="text-orange-500" />
          }
        />

        {/* COMPLETED */}
        <StatCard
          label="Completed Deliveries"
          value={
            data?.completedDeliveries || 0
          }
          icon={
            <CheckCircle className="text-emerald-500" />
          }
        />

      </div>

      {/* ORDER STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* ORDERS */}
        <div className="bg-white rounded-2xl border p-6">

          <h2 className="text-xl font-bold mb-5">
            Order Statistics
          </h2>

          <div className="space-y-4">

            <MetricRow
              icon={
                <Package className="text-blue-500" />
              }
              label="Total Orders"
              value={
                data?.totalOrders || 0
              }
            />

            <MetricRow
              icon={
                <Truck className="text-orange-500" />
              }
              label="Assigned Orders"
              value={
                data?.assignedOrders || 0
              }
            />

          </div>

        </div>

        {/* TOP PARTNERS */}
        <div className="bg-white rounded-2xl border p-6">

          <h2 className="text-xl font-bold mb-5">
            Top Delivery Partners
          </h2>

          <div className="space-y-4">

            {data?.topPartners
              ?.length > 0 ? (

              data.topPartners.map(
                (partner) => (

                  <div
                    key={
                      partner._id
                    }
                    className="flex items-center justify-between bg-slate-100 rounded-xl p-4"
                  >

                    <div>

                      <h3 className="font-semibold">
                        {
                          partner.name
                        }
                      </h3>

                      <p className="text-sm text-slate-500">
                        {
                          partner.vehicleType
                        }
                      </p>

                    </div>

                    <div className="text-right">

                      <p className="font-bold text-emerald-600">
                        {money(
                          partner.totalEarnings
                        )}
                      </p>

                      <p className="text-xs text-slate-500">
                        Earnings
                      </p>

                    </div>

                  </div>
                )
              )

            ) : (

              <div className="text-slate-500">
                No delivery partners found
              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}

// =====================================
// STAT CARD
// =====================================

function StatCard({
  label,
  value,
  icon,
}) {

  return (

    <div className="bg-white border rounded-2xl p-5">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {label}
          </p>

          <h2 className="text-2xl font-bold mt-2">
            {value}
          </h2>

        </div>

        <div className="bg-slate-100 p-3 rounded-xl">
          {icon}
        </div>

      </div>

    </div>
  );
}

// =====================================
// METRIC ROW
// =====================================

function MetricRow({
  icon,
  label,
  value,
}) {

  return (

    <div className="flex items-center justify-between bg-slate-100 rounded-xl p-4">

      <div className="flex items-center gap-3">

        {icon}

        <span>
          {label}
        </span>

      </div>

      <span className="font-bold">
        {value}
      </span>

    </div>
  );
}