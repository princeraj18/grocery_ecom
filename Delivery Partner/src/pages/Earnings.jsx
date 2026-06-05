import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Earnings() {

  // =========================================
  // STATES
  // =========================================
  const [earnings, setEarnings] = useState([]);

  const [filteredEarnings, setFilteredEarnings] =
    useState([]);

  const [totalEarnings, setTotalEarnings] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [filter, setFilter] =
    useState("today");

  // =========================================
  // WITHDRAW STATES
  // =========================================
  const [withdrawAmount, setWithdrawAmount] =
    useState("");

  const [withdrawLoading, setWithdrawLoading] =
    useState(false);

  const [withdrawMessage, setWithdrawMessage] =
    useState("");

  // =========================================
  // FETCH EARNINGS
  // =========================================
  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {

    try {

      const token =
        localStorage.getItem("deliveryToken");

      const res = await axios.get(
        "http://localhost:5000/api/delivery-partners/earnings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {

        setEarnings(
          res.data.earnings || []
        );
      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  // =========================================
  // FILTER LOGIC
  // =========================================
  useEffect(() => {

    let filtered = [...earnings];

    const today = new Date();

    // =====================================
    // DATE RANGES
    // =====================================

    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const tomorrowStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    const yesterdayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 1
    );

    const last10Days = new Date();
    last10Days.setDate(
      today.getDate() - 10
    );

    const lastMonth = new Date();
    lastMonth.setMonth(
      today.getMonth() - 1
    );

    // =====================================
    // APPLY FILTERS
    // =====================================

    if (filter === "today") {

      filtered = filtered.filter(
        (order) => {

          const deliveredDate =
            new Date(order.deliveredAt);

          return (
            deliveredDate >= todayStart &&
            deliveredDate < tomorrowStart
          );
        }
      );
    }

    else if (
      filter === "yesterday"
    ) {

      filtered = filtered.filter(
        (order) => {

          const deliveredDate =
            new Date(order.deliveredAt);

          return (
            deliveredDate >= yesterdayStart &&
            deliveredDate < todayStart
          );
        }
      );
    }

    else if (
      filter === "10days"
    ) {

      filtered = filtered.filter(
        (order) => {

          const deliveredDate =
            new Date(order.deliveredAt);

          return (
            deliveredDate >= last10Days
          );
        }
      );
    }

    else if (
      filter === "month"
    ) {

      filtered = filtered.filter(
        (order) => {

          const deliveredDate =
            new Date(order.deliveredAt);

          return (
            deliveredDate >= lastMonth
          );
        }
      );
    }

    // =====================================
    // SORT LATEST FIRST
    // =====================================

    filtered.sort(
      (a, b) =>
        new Date(b.deliveredAt) -
        new Date(a.deliveredAt)
    );

    // =====================================
    // SET FILTERED DATA
    // =====================================

    setFilteredEarnings(filtered);

    // =====================================
    // CALCULATE TOTAL
    // =====================================

    const total = filtered.reduce(
      (acc, order) =>
        acc +
        Number(
          order.partnerEarning || 0
        ),
      0
    );

    setTotalEarnings(total);

  }, [earnings, filter]);

  // =========================================
  // WITHDRAW REQUEST
  // =========================================
  const handleWithdraw = async () => {

    try {

      setWithdrawMessage("");

      if (!withdrawAmount) {

        return setWithdrawMessage(
          "Please enter amount"
        );
      }

      if (
        Number(withdrawAmount) <= 0
      ) {

        return setWithdrawMessage(
          "Invalid amount"
        );
      }

      if (
        Number(withdrawAmount) >
        totalEarnings
      ) {

        return setWithdrawMessage(
          "Insufficient balance"
        );
      }

      setWithdrawLoading(true);

      const token =
        localStorage.getItem(
          "deliveryToken"
        );

      const res = await axios.post(
        "http://localhost:5000/api/delivery-partners/withdraw-request",
        {
          amount:
            Number(withdrawAmount),
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {

        setWithdrawMessage(
          "Withdraw request submitted successfully"
        );

        setWithdrawAmount("");
      }

    } catch (error) {

      console.log(error);

      setWithdrawMessage(
        error?.response?.data
          ?.message ||
          "Failed to submit request"
      );

    } finally {

      setWithdrawLoading(false);
    }
  };

  // =========================================
  // LOADING
  // =========================================
  if (loading) {

    return (
      <div className="text-white text-lg">
        Loading earnings...
      </div>
    );
  }

  return (

    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <h1 className="text-2xl font-bold text-white">
          Earnings Hub
        </h1>

        {/* FILTER BUTTONS */}
        <div className="flex flex-wrap gap-2">

          <button
            onClick={() =>
              setFilter("today")
            }
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              filter === "today"
                ? "bg-emerald-500 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Today
          </button>

          <button
            onClick={() =>
              setFilter("yesterday")
            }
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              filter === "yesterday"
                ? "bg-emerald-500 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Yesterday
          </button>

          <button
            onClick={() =>
              setFilter("10days")
            }
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              filter === "10days"
                ? "bg-emerald-500 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Last 10 Days
          </button>

          <button
            onClick={() =>
              setFilter("month")
            }
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              filter === "month"
                ? "bg-emerald-500 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Last Month
          </button>

        </div>

      </div>

      {/* TOTAL EARNINGS CARD */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-800">

        <p className="text-sm text-slate-400 font-medium">
          Total Earnings
        </p>

        <p className="text-4xl font-extrabold text-white mt-2">
          ₹{totalEarnings}
        </p>

        <p className="text-sm text-emerald-400 mt-2">
          {
            filteredEarnings.length
          }{" "}
          deliveries completed
        </p>

      </div>

      {/* WITHDRAW SECTION */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">

        <h2 className="text-lg font-bold text-white mb-4">
          Withdraw Earnings
        </h2>

        <div className="flex flex-col sm:flex-row gap-3">

          <input
            type="number"
            placeholder="Enter amount"
            value={withdrawAmount}
            onChange={(e) =>
              setWithdrawAmount(
                e.target.value
              )
            }
            className="flex-1 bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl outline-none"
          />

          <button
            onClick={handleWithdraw}
            disabled={withdrawLoading}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            {withdrawLoading
              ? "Processing..."
              : "Withdraw"}
          </button>

        </div>

        {withdrawMessage && (

          <p className="mt-3 text-sm text-emerald-400">
            {withdrawMessage}
          </p>

        )}

      </div>

      {/* EARNINGS HISTORY */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">

        <div className="p-5 border-b border-slate-800">

          <h2 className="font-bold text-white">
            Earnings History
          </h2>

        </div>

        <div className="divide-y divide-slate-800">

          {filteredEarnings.length ===
          0 ? (

            <div className="p-6 text-center text-slate-400">
              No earnings found
            </div>

          ) : (

            filteredEarnings.map(
              (order) => (

                <div
                  key={order._id}
                  className="p-4 flex justify-between items-center"
                >

                  <div>

                    <p className="text-sm font-medium text-slate-200">
                      Order #
                      {order._id.slice(
                        -6
                      )}
                    </p>

                    <p className="text-xs text-slate-500">
                      Delivered on{" "}
                      {new Date(
                        order.deliveredAt
                      ).toLocaleDateString()}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      Customer:{" "}
                      {
                        order
                          .shippingAddress
                          ?.firstName
                      }{" "}
                      {
                        order
                          .shippingAddress
                          ?.lastName
                      }
                    </p>

                  </div>

                  <span className="font-bold text-emerald-400 text-lg">
                    +₹
                    {order.partnerEarning ||
                      0}
                  </span>

                </div>
              )
            )
          )}

        </div>

      </div>

    </div>
  );
}