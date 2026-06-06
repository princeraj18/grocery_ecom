import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("deliveryToken");

      const res = await axios.get(
  "http://localhost:5000/api/delivery-partners/dashboard",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

console.log("Dashboard API:", res.data);

setDashboard(res.data);

      if (res.data.success) {
        setDashboard(res.data);
      }
    } catch (error) {
      console.log("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-white text-lg">
        Loading dashboard...
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="text-red-400">
        Failed to load dashboard
      </div>
    );
  }

  const stats = dashboard.stats || {};
  const activeOrder = dashboard.activeOrder;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <h1 className="text-2xl sm:text-3xl font-bold text-white">
        Welcome back, {dashboard.partnerName || "Partner"}!
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        
        {/* Today's Earnings */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <p className="text-slate-400 text-sm">
            Today's Earnings
          </p>

          <p className="text-3xl font-bold text-emerald-400 mt-2">
            ₹{Number(stats.todayEarnings || 0).toLocaleString("en-IN")}
          </p>
        </div>

        {/* Wallet Balance */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <p className="text-slate-400 text-sm">
            Wallet Balance
          </p>

          <p className="text-3xl font-bold text-green-400 mt-2">
            ₹{Number(stats.walletBalance || 0).toLocaleString("en-IN")}
          </p>
        </div>

        {/* Total Earnings */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <p className="text-slate-400 text-sm">
            Total Earnings
          </p>

          <p className="text-3xl font-bold text-cyan-400 mt-2">
            ₹{Number(stats.totalEarnings || 0).toLocaleString("en-IN")}
          </p>
        </div>

        {/* Completed Trips */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <p className="text-slate-400 text-sm">
            Completed Trips
          </p>

          <p className="text-3xl font-bold text-white mt-2">
            {stats.completedTrips || 0}
          </p>
        </div>

        {/* Acceptance Rate */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <p className="text-slate-400 text-sm">
            Acceptance Rate
          </p>

          <p className="text-3xl font-bold text-orange-500 mt-2">
            {stats.acceptanceRate || 0}%
          </p>
        </div>
      </div>

      {/* Active Assignment */}
      {activeOrder && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">
              Active Assignment
            </h2>

            <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-semibold rounded-full">
              {activeOrder.orderStatus}
            </span>
          </div>

          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-xl">🏪</span>

              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  Pickup From
                </p>

                <p className="text-sm text-slate-200">
                  {activeOrder.pickupAddress}
                </p>
              </div>
            </div>

            <div className="w-0.5 h-6 bg-slate-800 ml-2.5"></div>

            <div className="flex items-start gap-3">
              <span className="text-xl">📍</span>

              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  Drop To
                </p>

                <p className="text-sm text-slate-200">
                  {activeOrder.deliveryAddress}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!activeOrder && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <p className="text-slate-400 text-center">
            No active assignment available
          </p>
        </div>
      )}
    </div>
  );
}