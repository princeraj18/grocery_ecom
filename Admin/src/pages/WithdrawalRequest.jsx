import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  IndianRupee,
  Phone,
  Mail,
} from "lucide-react";
import api from "../services/api";

const STATUS_STYLES = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Rejected: "bg-rose-50 text-rose-700 border-rose-200",
};

const WithdrawalRequest = () => {
  const [requests, setRequests] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState(null);
  const navigate = useNavigate();

  const fetchRequests = useCallback(async () => {
    try {
      const response = await api.get("/admin/withdraw-requests");
      if (response.data?.success) {
        setRequests(response.data.withdrawRequests || []);
        setSummary(response.data.summary || null);
      }
    } catch (error) {
      console.error("Error fetching withdrawal requests:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this withdrawal request? The amount will be deducted from the partner's wallet.")) {
      return;
    }

    setActionLoading(id);
    try {
      const response = await api.put(`/admin/withdraw-requests/${id}/approve`);
      if (response.data?.success) {
        await fetchRequests();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to approve request");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this withdrawal request?")) {
      return;
    }

    setActionLoading(id);
    try {
      const response = await api.put(`/admin/withdraw-requests/${id}/reject`);
      if (response.data?.success) {
        await fetchRequests();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to reject request");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredRequests = requests.filter((request) => {
    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;

    const search = searchTerm.trim().toLowerCase();
    const partner = request.partner || {};
    const matchesSearch =
      !search ||
      partner.name?.toLowerCase().includes(search) ||
      partner.email?.toLowerCase().includes(search) ||
      partner.phone?.toLowerCase().includes(search);

    return matchesStatus && matchesSearch;
  });

  const pendingCount = summary?.pendingCount ?? requests.filter((r) => r.status === "Pending").length;
  const approvedCount = summary?.approvedCount ?? requests.filter((r) => r.status === "Approved").length;
  const rejectedCount = summary?.rejectedCount ?? requests.filter((r) => r.status === "Rejected").length;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Withdrawal Requests
          </h1>
          <p className="text-slate-500 mt-1">
            Review and manage delivery partner payout requests.
          </p>
        </div>

        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/3 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by partner name, email, phone..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">
              Pending
            </p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">
              {pendingCount}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
            <IndianRupee className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">
              Pending Amount
            </p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">
              ₹{summary?.pendingAmount?.toLocaleString("en-IN") || 0}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">
              Approved
            </p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">
              {approvedCount}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
            <XCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">
              Rejected
            </p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">
              {rejectedCount}
            </h3>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {["all", "Pending", "Approved", "Rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              statusFilter === status
                ? "bg-indigo-600 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {status === "all" ? "All Requests" : status}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="p-12 text-center">
            <Wallet className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">
              No withdrawal requests found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Partner
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Wallet Balance
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Requested On
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredRequests.map((request) => {
                  const partner = request.partner || {};
                  const isProcessing = actionLoading === request._id;

                  return (
                    <tr
                      key={request._id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm uppercase flex-shrink-0">
                            {partner.name?.slice(0, 2) || "DP"}
                          </div>
                          <div>
                            <button
                              onClick={() =>
                                partner._id &&
                                navigate(
                                  `/admin/delivery-partners/${partner._id}`
                                )
                              }
                              className="font-semibold text-slate-800 hover:text-indigo-600 transition-colors text-left"
                            >
                              {partner.name || "Unknown Partner"}
                            </button>
                            <div className="flex flex-col gap-0.5 mt-1">
                              {partner.email && (
                                <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                                  <Mail className="h-3 w-3" />
                                  {partner.email}
                                </span>
                              )}
                              {partner.phone && (
                                <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                                  <Phone className="h-3 w-3" />
                                  {partner.phone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-800">
                          ₹{request.amount?.toLocaleString("en-IN")}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">
                          ₹{(partner.walletBalance || 0).toLocaleString("en-IN")}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            STATUS_STYLES[request.status] ||
                            "bg-slate-50 text-slate-600 border-slate-200"
                          }`}
                        >
                          {request.status === "Pending" && (
                            <Clock className="h-3 w-3" />
                          )}
                          {request.status === "Approved" && (
                            <CheckCircle className="h-3 w-3" />
                          )}
                          {request.status === "Rejected" && (
                            <XCircle className="h-3 w-3" />
                          )}
                          {request.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500">
                        {formatDate(request.createdAt)}
                      </td>

                      <td className="px-6 py-4">
                        {request.status === "Pending" ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApprove(request._id)}
                              disabled={isProcessing}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                              {isProcessing ? "..." : "Approve"}
                            </button>
                            <button
                              onClick={() => handleReject(request._id)}
                              disabled={isProcessing}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50 transition-colors"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              {isProcessing ? "..." : "Reject"}
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end">
                            <span className="text-xs text-slate-400 italic">
                              Processed
                            </span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-sm text-slate-500 mt-4">
        Showing {filteredRequests.length} of {requests.length} request(s)
      </p>
    </div>
  );
};

export default WithdrawalRequest;
