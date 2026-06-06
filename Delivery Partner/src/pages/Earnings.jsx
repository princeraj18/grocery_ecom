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

  const [walletBalance, setWalletBalance] =
    useState(0);

  const [allTimeEarnings, setAllTimeEarnings] =
    useState(0);

  const [withdrawnAmount, setWithdrawnAmountState] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [filter, setFilter] =
    useState("all");

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
        setWalletBalance(res.data.walletBalance || 0);
        setAllTimeEarnings(res.data.totalEarnings || 0);
        setWithdrawnAmountState(res.data.withdrawnAmount || 0);
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
        walletBalance
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
        fetchEarnings();
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
              setFilter("all")
            }
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              filter === "all"
                ? "bg-emerald-500 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            All Time
          </button>

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

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Wallet Balance */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-800 shadow-lg">
          <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">
            Wallet Balance
          </p>
          <p className="text-3xl font-extrabold text-emerald-400 mt-2">
            ₹{Number(walletBalance).toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Available for withdrawal
          </p>
        </div>

        {/* Total Earnings */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-800 shadow-lg">
          <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">
            Total Earnings (All-Time)
          </p>
          <p className="text-3xl font-extrabold text-cyan-400 mt-2">
            ₹{Number(allTimeEarnings).toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            All lifetime earnings
          </p>
        </div>

        {/* Withdrawn Amount */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-800 shadow-lg">
          <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">
            Withdrawn Amount
          </p>
          <p className="text-3xl font-extrabold text-orange-400 mt-2">
            ₹{Number(withdrawnAmount).toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Transferred to bank
          </p>
        </div>
      </div>

      {/* FILTER SUMMARY CARD */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <p className="text-sm text-slate-300">
          Showing stats for: <span className="font-semibold text-white capitalize">{filter === '10days' ? 'Last 10 Days' : filter === 'all' ? 'All Time' : filter}</span>
        </p>
        <div className="flex flex-wrap gap-4">
          <span className="text-sm text-slate-400">
            Deliveries: <span className="font-bold text-white">{filteredEarnings.length}</span>
          </span>
          <span className="text-sm text-slate-400">
            Period Earnings: <span className="font-bold text-emerald-400">₹{Number(totalEarnings).toLocaleString("en-IN")}</span>
          </span>
        </div>
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