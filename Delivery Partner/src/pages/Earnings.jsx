import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Wallet, 
  TrendingUp, 
  ArrowUpRight, 
  Calendar, 
  Package, 
  Clock, 
  User, 
  IndianRupee, 
  AlertCircle 
} from "lucide-react";

export default function Earnings() {

  // =========================================
  // STATES
  // =========================================
  const [earnings, setEarnings] = useState([]);
  const [filteredEarnings, setFilteredEarnings] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [allTimeEarnings, setAllTimeEarnings] = useState(0);
  const [withdrawnAmount, setWithdrawnAmountState] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // =========================================
  // WITHDRAW STATES
  // =========================================
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawMessage, setWithdrawMessage] = useState("");

  // =========================================
  // FETCH EARNINGS
  // =========================================
  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const token = localStorage.getItem("deliveryToken");
      const res = await axios.get(
        "http://localhost:5000/api/delivery-partners/earnings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setEarnings(res.data.earnings || []);
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

    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const tomorrowStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const yesterdayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);

    const last10Days = new Date();
    last10Days.setDate(today.getDate() - 10);

    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);

    if (filter === "today") {
      filtered = filtered.filter((order) => {
        const deliveredDate = new Date(order.deliveredAt);
        return deliveredDate >= todayStart && deliveredDate < tomorrowStart;
      });
    } else if (filter === "yesterday") {
      filtered = filtered.filter((order) => {
        const deliveredDate = new Date(order.deliveredAt);
        return deliveredDate >= yesterdayStart && deliveredDate < todayStart;
      });
    } else if (filter === "10days") {
      filtered = filtered.filter((order) => {
        const deliveredDate = new Date(order.deliveredAt);
        return deliveredDate >= last10Days;
      });
    } else if (filter === "month") {
      filtered = filtered.filter((order) => {
        const deliveredDate = new Date(order.deliveredAt);
        return deliveredDate >= lastMonth;
      });
    }

    filtered.sort((a, b) => new Date(b.deliveredAt) - new Date(a.deliveredAt));
    setFilteredEarnings(filtered);

    const total = filtered.reduce(
      (acc, order) => acc + Number(order.partnerEarning || 0),
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
        return setWithdrawMessage("Please enter amount");
      }
      if (Number(withdrawAmount) <= 0) {
        return setWithdrawMessage("Invalid amount");
      }
      if (Number(withdrawAmount) > walletBalance) {
        return setWithdrawMessage("Insufficient balance");
      }

      setWithdrawLoading(true);
      const token = localStorage.getItem("deliveryToken");

      const res = await axios.post(
        "http://localhost:5000/api/delivery-partners/withdraw-request",
        { amount: Number(withdrawAmount) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setWithdrawMessage("Withdraw request submitted successfully");
        setWithdrawAmount("");
        fetchEarnings();
      }
    } catch (error) {
      console.log(error);
      setWithdrawMessage(
        error?.response?.data?.message || "Failed to submit request"
      );
    } finally {
      setWithdrawLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded-lg w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-32 bg-gray-200 rounded-2xl" />
          <div className="h-32 bg-gray-200 rounded-2xl" />
          <div className="h-32 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6 bg-gray-50/30 min-h-screen font-sans">
      
      {/* HEADER & FILTER ACTION NAVIGATION BLOCK */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-xl font-bold text-gray-900 uppercase tracking-wider">
            Earnings Hub
          </h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
            Track payouts, verify operational metrics, and manage your ledger transfers
          </p>
        </div>

        {/* FILTER TAB BAR SEGMENTS */}
        <div className="flex flex-wrap gap-1.5 bg-gray-100 p-1 rounded-xl border border-gray-200/40 self-start lg:self-center">
          {[
            { id: "all", label: "All Time" },
            { id: "today", label: "Today" },
            { id: "yesterday", label: "Yesterday" },
            { id: "10days", label: "Last 10 Days" },
            { id: "month", label: "Last Month" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wide transition-all ${
                filter === tab.id
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200/30"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* CORE FINANCIAL LEDGER STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Available Wallet Balance */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/70 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-1 z-10">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Wallet size={12} className="text-emerald-500" /> Wallet Balance
            </span>
            <p className="text-2xl font-black text-gray-900 tracking-tight mt-1">
              ₹{Number(walletBalance).toLocaleString("en-IN")}
            </p>
          </div>
          <p className="text-[10px] text-gray-400 font-medium mt-4 pt-2 border-t border-gray-100 uppercase tracking-wider">
            Cleared liquid assets available to request
          </p>
        </div>

        {/* Lifetime Value Gross Accrued */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/70 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-1 z-10">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp size={12} className="text-blue-500" /> Gross Income
            </span>
            <p className="text-2xl font-black text-gray-900 tracking-tight mt-1">
              ₹{Number(allTimeEarnings).toLocaleString("en-IN")}
            </p>
          </div>
          <p className="text-[10px] text-gray-400 font-medium mt-4 pt-2 border-t border-gray-100 uppercase tracking-wider">
            All lifetime operational revenues accrued
          </p>
        </div>

        {/* Capital Relieved Out to Bank Account */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/70 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-1 z-10">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <ArrowUpRight size={12} className="text-orange-500" /> Settled Capital
            </span>
            <p className="text-2xl font-black text-gray-900 tracking-tight mt-1">
              ₹{Number(withdrawnAmount).toLocaleString("en-IN")}
            </p>
          </div>
          <p className="text-[10px] text-gray-400 font-medium mt-4 pt-2 border-t border-gray-100 uppercase tracking-wider">
            Revenues completely wired out to your bank
          </p>
        </div>
      </div>

      {/* DYNAMIC TIMELINE SUMMARY LOG CONTEXT BANNER */}
      <div className="bg-white px-5 py-3.5 rounded-xl border border-gray-200/70 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <Calendar size={13} className="text-gray-400" />
          <p className="text-xs text-gray-600 font-medium">
            Active Timeline Context:{" "}
            <span className="font-bold text-gray-900 capitalize bg-gray-100 px-2 py-0.5 rounded text-[11px]">
              {filter === "10days" ? "Last 10 Days" : filter === "all" ? "All Time" : filter}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-500">
          <span>
            Delivered Logs: <span className="text-gray-900">{filteredEarnings.length}</span>
          </span>
          <span className="h-3 w-px bg-gray-200 hidden sm:block" />
          <span>
            Period Aggregate: <span className="text-emerald-600">₹{Number(totalEarnings).toLocaleString("en-IN")}</span>
          </span>
        </div>
      </div>

      {/* WITHDRAW ACTION TRIGGER PANEL */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200/70 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Disburse Funds Request
          </h2>
          <p className="text-[10px] text-gray-400 font-medium mt-0.5">
            Submit a direct settlement dispatch request for cleared ledger balance to your bank account
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <IndianRupee size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
            <input
              type="number"
              placeholder="0.00"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium text-gray-800 focus:outline-none focus:border-gray-300 transition-colors placeholder:text-gray-300"
            />
          </div>

          <button
            onClick={handleWithdraw}
            disabled={withdrawLoading}
            className="bg-orange-500 hover:bg-orange-600 active:scale-[0.99] disabled:opacity-50 text-white text-[11px] font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-sm"
          >
            {withdrawLoading ? "Processing dispatch..." : "Initiate Withdrawal"}
          </button>
        </div>

        {withdrawMessage && (
          <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50/50 p-2.5 rounded-lg border border-amber-100 mt-2">
            <AlertCircle size={13} />
            <p className="font-semibold">{withdrawMessage}</p>
          </div>
        )}
      </div>

      {/* OPERATIONAL EARNINGS HISTORY LOG INDEX LIST */}
      <div className="bg-white rounded-2xl border border-gray-200/70 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-2">
          <Package size={14} className="text-gray-400" />
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Revenues Index History
          </h2>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredEarnings.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-400 font-medium">
              No matching ledger settlement logs found for the filtered span.
            </div>
          ) : (
            filteredEarnings.map((order) => (
              <div
                key={order._id}
                className="p-4 sm:px-6 hover:bg-gray-50/40 transition-colors flex justify-between items-center"
              >
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-800">
                    Order ID: #{order._id.slice(-6).toUpperCase()}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-3 text-[10px] text-gray-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {new Date(order.deliveredAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </span>
                    <span className="h-2 w-px bg-gray-200" />
                    <span className="flex items-center gap-1 uppercase">
                      <User size={11} />
                      {order.shippingAddress?.firstName || "N/A"}{" "}
                      {order.shippingAddress?.lastName || ""}
                    </span>
                  </div>
                </div>

                <span className="font-black text-emerald-600 text-sm tracking-tight bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                  +₹{Number(order.partnerEarning || 0).toLocaleString("en-IN")}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}