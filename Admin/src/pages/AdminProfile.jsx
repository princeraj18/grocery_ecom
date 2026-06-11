import React, { useEffect, useState } from "react";
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Clock, 
  KeyRound, 
  LogOut, 
  Loader2, 
  AlertCircle 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import Sidebar from "../components/Sidebar";
// import Navbar from "../components/Navbar";

const AdminProfile = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // FETCH ADMIN PROFILE DATA
  // =========================================
  const fetchAdminProfile = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Hits your router.get("/profile", getAdminProfile)
      const { data } = await api.get("/admin/profile");
      
      if (data.success) {
        setAdminData(data.admin);
      } else {
        setError("Could not parse profile structure context data.");
      }
    } catch (err) {
      console.error("PROFILE FETCH REJECTION ERROR:", err);
      setError(
        err.response?.data?.message || 
        "Failed to pull security context details from server."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // LOGOUT HANDLER
  // =========================================
  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to terminate your session?");
    if (!confirmLogout) return;

    try {
      const refreshToken = localStorage.getItem("refreshToken");
      
      // Attempt backend refresh token clearance 
      if (refreshToken) {
        await api.post("/logout", { refreshToken });
      }
    } catch (err) {
      console.error("BACKEND LOGOUT LOG SYNC ERROR:", err);
    } finally {
      // Always purge storage data maps locally regardless of backend network state
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("adminId");
      
      alert("Session securely terminated.");
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  // =========================================
  // ASYNC LOADER WINDOW
  // =========================================
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-poppins gap-3">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
        <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
          Syncing Cryptographic Credentials...
        </span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-poppins overflow-hidden">
      
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR SYSTEM INTEGRATION */}
      {/* <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}

      {/* MAIN CONTAINER WORKSPACE */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* NAVBAR INTEGRATION WITH TOGGLE */}
        {/* <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}

        {/* CORE LAYOUT INNER SCROLL */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* COMPONENT ACCENT TITLE BANNER */}
            <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="text-indigo-600" size={26} />
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-wide uppercase">
                  Security Account Context
                </h1>
              </div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">
                View cryptographic profiles, credentials, and configuration boundaries
              </p>
            </div>

            {/* CONDITIONAL ERROR DISPATCH ALERT BOX */}
            {error ? (
              <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-rose-700 text-sm font-semibold flex items-center gap-3 shadow-xs">
                <AlertCircle className="shrink-0" size={18} />
                <p>{error}</p>
              </div>
            ) : (
              /* CORE INFORMATION WRAPPER CARD */
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                
                {/* DECORATIVE TOP GRAPHIC COVER ST Tint */}
                <div className="h-24 bg-linear-to-r from-indigo-600 to-indigo-800 relative flex items-end px-6 md:px-8">
                  <div className="absolute -bottom-10 left-6 md:left-8 rounded-2xl border-4 border-white bg-slate-100 p-3 shadow-md text-indigo-600">
                    <User size={38} strokeWidth={2.5} />
                  </div>
                </div>

                {/* USER MAIN METADATA BLOCK */}
                <div className="pt-14 p-6 md:p-8 space-y-6">
                  
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                      {adminData?.name || "System Master Admin"}
                    </h2>
                    <span className="inline-block mt-1 text-[10px] font-black uppercase tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-md">
                      Role Privilege: {adminData?.role || "Super Admin"}
                    </span>
                  </div>

                  <hr className="border-slate-100 dark:border-slate-800" />

                  {/* ACCOUNT DATA METRIC FIELDS ROWS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* EMAIL ADDRESS PROFILE METADATA */}
                    <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                      <Mail size={18} className="text-slate-400 mt-0.5 shrink-0" />
                      <div className="truncate">
                        <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                          Cryptographic Address Alias
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 truncate block">
                          {adminData?.email || "admin@platform.com"}
                        </span>
                      </div>
                    </div>

                    {/* MONGO RECORD UNIQUE SYSTEM KEY ID */}
                    <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                      <KeyRound size={18} className="text-slate-400 mt-0.5 shrink-0" />
                      <div className="truncate">
                        <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                          Internal Key Identifier (_id)
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 truncate block">
                          {adminData?._id || "64f19b28a4120bc9e108d4f2"}
                        </span>
                      </div>
                    </div>

                    {/* ACCOUNT HISTORICAL INCEPTION DATE RECORD */}
                    {adminData?.createdAt && (
                      <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                        <Clock size={18} className="text-slate-400 mt-0.5 shrink-0" />
                        <div>
                          <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                            Profile Sequence Creation Timestamp
                          </span>
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            {new Date(adminData.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* CONTROL BUTTON DECK ACTION CONSOLE */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-3">
                    <button
                      onClick={() => navigate("/admin/forgot-password")}
                      className="text-xs font-bold border border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-100 px-5 py-3 rounded-xl transition flex items-center gap-1.5 shadow-2xs"
                    >
                      <KeyRound size={14} />
                      <span>Request Security Credentials Reset</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="text-xs font-bold border border-rose-200 hover:border-rose-300 bg-rose-50 text-rose-600 hover:bg-rose-100 px-5 py-3 rounded-xl transition flex items-center gap-1.5 ml-auto shadow-2xs w-full sm:w-auto justify-center"
                    >
                      <LogOut size={14} />
                      <span>Terminate Authorization Session</span>
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminProfile;