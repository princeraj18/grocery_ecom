import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {

  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {

    try {

      const token =
        localStorage.getItem("deliveryToken");

      const res = await axios.get(
        "http://localhost:5000/api/delivery-partners/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDashboard(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  if (!dashboard) {
    return (
      <div className="text-white">
        Loading dashboard...
      </div>
    );
  }

  const { stats, activeOrder } = dashboard;

  return (
    <div className="space-y-6">

      <h1 className="text-2xl sm:text-3xl font-bold text-white">
  Welcome back, {dashboard.partnerName}!
</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <p className="text-slate-400 text-sm font-medium">
            Today's Earnings
          </p>

          <p className="text-3xl font-bold text-emerald-400 mt-2">
            ₹{stats.todayEarnings}
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <p className="text-slate-400 text-sm font-medium">
            Completed Trips
          </p>

          <p className="text-3xl font-bold text-white mt-2">
            {stats.completedTrips}
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <p className="text-slate-400 text-sm font-medium">
            Acceptance Rate
          </p>

          <p className="text-3xl font-bold text-orange-500 mt-2">
            {stats.acceptanceRate}%
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

                <p className="text-sm font-medium text-slate-200">
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

                <p className="text-sm font-medium text-slate-200">
                  {activeOrder.deliveryAddress}
                </p>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}