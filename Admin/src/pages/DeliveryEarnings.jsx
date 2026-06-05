import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CheckCircle,
  Clock3,
  IndianRupee,
  Wallet,
  XCircle,
} from "lucide-react";
import api from "../services/api";

const money = (value = 0) =>
  `Rs ${Number(value || 0).toLocaleString("en-IN")}`;

export default function DeliveryEarnings() {

  const [data, setData] =
    useState(null);
  const [loading, setLoading] =
    useState(true);
  const [actionLoading, setActionLoading] =
    useState("");
  const [message, setMessage] =
    useState("");

  const fetchEarnings =
    async () => {
      try {
        const res =
          await api.get(
            "/admin/delivery-earnings"
          );

        if (res.data.success) {
          setData(res.data.earnings);
        }
      } catch (error) {
        console.log(error);
        setMessage(
          error?.response?.data?.message ||
            "Failed to load delivery earnings"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchEarnings();
  }, []);

  const handleWithdrawAction =
    async (id, action) => {
      try {
        setActionLoading(`${action}-${id}`);
        setMessage("");

        const res =
          await api.put(
            `/admin/withdraw-requests/${id}/${action}`
          );

        setMessage(res.data.message);
        await fetchEarnings();
      } catch (error) {
        console.log(error);
        setMessage(
          error?.response?.data?.message ||
            "Unable to update withdraw request"
        );
      } finally {
        setActionLoading("");
      }
    };

  const pendingRequests =
    useMemo(
      () =>
        data?.withdrawRequests?.filter(
          (request) =>
            request.status === "Pending"
        ) || [],
      [data]
    );

  const computedSummary = useMemo(() => {
    if (!data) return {
      totalEarnings: 0,
      walletBalance: 0,
      withdrawnAmount: 0,
      pendingWithdrawAmount: 0,
    };

    if (data.summary) return data.summary;

    const partners = data.partners || [];
    const withdraws = data.withdrawRequests || [];

    const summary = partners.reduce(
      (acc, partner) => {
        acc.totalEarnings += partner.totalEarnings || 0;
        acc.walletBalance += partner.walletBalance || 0;
        acc.withdrawnAmount += partner.withdrawnAmount || 0;
        return acc;
      },
      { totalEarnings: 0, walletBalance: 0, withdrawnAmount: 0 }
    );

    summary.pendingWithdrawAmount = withdraws
      .filter((r) => r.status === "Pending")
      .reduce((t, r) => t + (r.amount || 0), 0);

    return summary;
  }, [data]);

  if (loading) {
    return (
      <div className="p-6 text-slate-700 dark:text-slate-100">
        Loading delivery earnings...
      </div>
    );
  }

  const summary = computedSummary || {};

  return (
    <div className="space-y-6 p-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">
          Delivery Earnings
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Review partner earnings, wallet balances, and withdraw requests.
        </p>
        {message && (
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            {message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={<IndianRupee />}
          label="Total Earnings"
          value={money(summary.totalEarnings)}
        />
        <SummaryCard
          icon={<Wallet />}
          label="Wallet Balance"
          value={money(summary.walletBalance)}
        />
        <SummaryCard
          icon={<CheckCircle />}
          label="Withdrawn"
          value={money(summary.withdrawnAmount)}
        />
        <SummaryCard
          icon={<Clock3 />}
          label="Pending Withdraw"
          value={money(summary.pendingWithdrawAmount)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-5 dark:border-slate-800">
            <h2 className="text-xl font-bold">
              Partner Balances
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <tr>
                  <th className="px-4 py-3">
                    Partner
                  </th>
                  <th className="px-4 py-3">
                    Earnings
                  </th>
                  <th className="px-4 py-3">
                    Wallet
                  </th>
                  <th className="px-4 py-3">
                    Withdrawn
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {data?.partners?.length ? (
                  data.partners.map((partner) => (
                    <tr key={partner._id}>
                      <td className="px-4 py-3">
                        <p className="font-semibold">
                          {partner.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {partner.phone}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        {money(partner.totalEarnings)}
                      </td>
                      <td className="px-4 py-3">
                        {money(partner.walletBalance)}
                      </td>
                      <td className="px-4 py-3">
                        {money(partner.withdrawnAmount)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="px-4 py-6 text-center text-slate-500"
                      colSpan="4"
                    >
                      No delivery partners found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-5 dark:border-slate-800">
            <h2 className="text-xl font-bold">
              Withdraw Requests
            </h2>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {data?.withdrawRequests?.length ? (
              data.withdrawRequests.map((request) => (
                <div
                  key={request._id}
                  className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold">
                      {request.partner?.name ||
                        "Unknown Partner"}
                    </p>
                    <p className="text-sm text-slate-500">
                      {money(request.amount)} requested on{" "}
                      {new Date(
                        request.createdAt
                      ).toLocaleDateString()}
                    </p>
                    <span className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {request.status}
                    </span>
                  </div>

                  {request.status === "Pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleWithdrawAction(
                            request._id,
                            "approve"
                          )
                        }
                        disabled={
                          actionLoading ===
                          `approve-${request._id}`
                        }
                        className="inline-flex items-center gap-2 rounded bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                      >
                        <CheckCircle size={16} />
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          handleWithdrawAction(
                            request._id,
                            "reject"
                          )
                        }
                        disabled={
                          actionLoading ===
                          `reject-${request._id}`
                        }
                        className="inline-flex items-center gap-2 rounded bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-500">
                No withdraw requests found
              </div>
            )}
          </div>
        </section>
      </div>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 p-5 dark:border-slate-800">
          <h2 className="text-xl font-bold">
            Recent Delivered Earnings
          </h2>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {data?.deliveredOrders?.length ? (
            data.deliveredOrders.map((order) => (
              <div
                key={order._id}
                className="flex items-center justify-between p-4"
              >
                <div>
                  <p className="font-semibold">
                    Order #{order._id.slice(-6)}
                  </p>
                  <p className="text-sm text-slate-500">
                    {order.deliveryPartner?.name ||
                      "Delivery partner"}{" "}
                    -{" "}
                    {order.deliveredAt
                      ? new Date(
                          order.deliveredAt
                        ).toLocaleDateString()
                      : "Delivered"}
                  </p>
                </div>
                <p className="font-bold text-emerald-600 dark:text-emerald-400">
                  +{money(order.partnerEarning)}
                </p>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-slate-500">
              No delivered earnings found
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            {value}
          </h2>
        </div>
        <div className="rounded-lg bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
          {icon}
        </div>
      </div>
    </div>
  );
}
