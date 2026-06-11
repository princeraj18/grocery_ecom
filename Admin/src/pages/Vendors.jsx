import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eye, Trash2, CheckCircle, XCircle, Store, Phone, Mail, User } from "lucide-react";
import api from "../services/api";

export default function Vendors() {
  const navigate = useNavigate();

  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");

  const fetchVendors = async () => {
    try {
      const { data } = await api.get(
        `/admin/vendors?search=${encodeURIComponent(search)}`
      );
      setVendors(data.vendors || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [search]);

  // =========================
  // DELETE VENDOR
  // =========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this vendor?"
    );

    if (!confirmDelete) return;

    try {
      const { data } = await api.delete(`/admin/vendors/${id}`);
      alert(data.message || "Vendor deleted");
      fetchVendors();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  // =========================
  // VERIFY VENDOR
  // =========================
  const handleVerify = async (id) => {
    try {
      const { data } = await api.put(`/vendors/verify/${id}`);
      alert(data.message || "Vendor verified successfully");
      fetchVendors();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Verification failed");
    }
  };

  // =========================
  // UNVERIFY VENDOR
  // =========================
  const handleUnverify = async (id) => {
    try {
      const { data } = await api.put(`/vendors/unverify/${id}`);
      alert(data.message || "Vendor unverified");
      fetchVendors();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Unverify failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 p-6 space-y-6 transition-colors duration-300">

      {/* ========================================================
          HEADER SECTION
         ======================================================== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <Store className="text-indigo-600 dark:text-indigo-400" size={24} />
            <h1 className="text-2xl md:text-3xl font-extrabold uppercase tracking-wide text-slate-900 dark:text-white">
              Vendor Registry
            </h1>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 uppercase font-black tracking-widest">
            Total Partners: <span className="text-indigo-600 dark:text-indigo-400 font-black">{vendors.length}</span>
          </p>
        </div>

        {/* SEARCH BOX */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search merchants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/70 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* ========================================================
          MOBILE INTERFACE (CARDS)
         ======================================================== */}
      <div className="grid gap-4 md:hidden">
        {vendors.map((vendor) => (
          <div
            key={vendor._id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/60 rounded-2xl p-5 shadow-2xs space-y-4"
          >
            <div className="flex justify-between items-start gap-2">
              <div>
                <h2 className="font-bold text-base text-slate-900 dark:text-white">{vendor.shopName}</h2>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
                  <User size={13} />
                  <span>{vendor.ownerName}</span>
                </div>
              </div>

              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${ 
                  vendor.isVerified 
                    ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40" 
                    : "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/40" 
                }`}
              >
                {vendor.isVerified ? "Verified" : "Pending"}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 space-y-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-slate-400 dark:text-slate-500" />
                <span className="font-mono truncate">{vendor.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-slate-400 dark:text-slate-500" />
                <span>{vendor.phone}</span>
              </div>
            </div>

            {/* Actions Grid */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex gap-2">
              <button
                onClick={() => navigate(`/admin/vendors/${vendor._id}`)}
                className="flex-1 flex items-center justify-center gap-1 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
              >
                <Eye size={14} />
                <span>View</span>
              </button>

              {!vendor.isVerified ? (
                <button
                  onClick={() => handleVerify(vendor._id)}
                  className="flex-1 flex items-center justify-center gap-1 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <CheckCircle size={14} />
                  <span>Verify</span>
                </button>
              ) : (
                <button
                  onClick={() => handleUnverify(vendor._id)}
                  className="flex-1 flex items-center justify-center gap-1 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/20 dark:hover:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <XCircle size={14} />
                  <span>Revoke</span>
                </button>
              )}

              <button
                onClick={() => handleDelete(vendor._id)}
                className="flex items-center justify-center bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 p-2 rounded-xl transition-all"
                title="Delete Vendor"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================
          DESKTOP INTERFACE (TABLE)
         ======================================================== */}
      <div className="hidden md:block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/70 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            
            <thead className="bg-slate-50 border-b border-slate-200 dark:bg-slate-900/60 dark:border-slate-800">
              <tr>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Shop Name</th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Merchant Owner</th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Email Address</th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Phone Contact</th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Verification Status</th>
                <th className="p-4 text-center text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {vendors.map((vendor) => (
                <tr key={vendor._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors duration-150">
                  <td className="p-4 text-sm font-bold text-slate-900 dark:text-white">{vendor.shopName}</td>
                  <td className="p-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{vendor.ownerName}</td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-400 font-mono truncate max-w-[220px]">{vendor.email}</td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-400 font-medium">{vendor.phone}</td>
                  
                  {/* Status Badge */}
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${ 
                        vendor.isVerified 
                          ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40" 
                          : "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/40" 
                      }`}
                    >
                      {vendor.isVerified ? (
                        <>
                          <CheckCircle size={12} />
                          <span>Verified</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={12} />
                          <span>Pending</span>
                        </>
                      )}
                    </span>
                  </td>

                  {/* Operational Controls */}
                  <td className="p-4">
                    <div className="flex items-center gap-2 justify-center">
                      <button
                        onClick={() => navigate(`/admin/vendors/${vendor._id}`)}
                        className="flex items-center gap-1.5 bg-white dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-2xs"
                        title="View Ledger Profile"
                      >
                        <Eye size={14} />
                        <span>View</span>
                      </button>

                      {!vendor.isVerified ? (
                        <button
                          onClick={() => handleVerify(vendor._id)}
                          className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-2xs"
                        >
                          <CheckCircle size={14} />
                          <span>Verify</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnverify(vendor._id)}
                          className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/20 dark:hover:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-2xs"
                        >
                          <XCircle size={14} />
                          <span>Revoke</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(vendor._id)}
                        className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-2xs"
                        title="Delete Merchant Record"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}