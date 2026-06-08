import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, ShieldAlert, UserCheck, Calendar, Hash, Loader2 } from "lucide-react";
import api from "../services/api";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH USER
  // =========================
  const fetchUser = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/users/${id}`);
      setUser(data.user);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  /* ========================================================
      LOADING STATE (SKELETON MATCH)
     ======================================================== */
  if (loading || !user) {
    return (
      <div className="min-h-full bg-slate-50 text-slate-800 p-6 flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">
          Retrieving Profile Records...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50 text-slate-800 p-6 space-y-6">

      {/* ========================================================
          HEADER WITH BACK INTERACTION
         ======================================================== */}
      <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
        <button
          onClick={() => navigate("/admin/users")}
          className="p-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl transition shadow-sm"
          title="Back to Users"
        >
          <ArrowLeft size={18} />
        </button>

        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold uppercase tracking-wide text-slate-900">
            Account Dossier
          </h1>
          <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-widest">
            Managing profile configurations for: <span className="text-indigo-600 font-black">{user.name}</span>
          </p>
        </div>
      </div>

      {/* ========================================================
          PROFILE INTERFACE CARD
         ======================================================== */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden max-w-4xl">
        
        {/* Decorative Top Banner */}
        <div className="h-24 bg-gradient-to-r from-indigo-600 to-violet-500 w-full" />

        {/* Profile Details Grid */}
        <div className="p-6 md:p-8 relative">
          
          {/* Avatar Header Ring */}
          <div className="absolute -top-12 left-6 md:left-8 h-20 w-20 bg-slate-100 border-4 border-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-md">
            <User size={36} strokeWidth={2} />
          </div>

          {/* Spacer block for avatar position stacking layer */}
          <div className="h-10" />

          {/* Details Row Configurations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            
            {/* Field: Full Name */}
            <div className="flex items-start gap-3.5 p-4 bg-slate-50/60 border border-slate-100 rounded-xl">
              <User size={20} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Full Name</span>
                <span className="text-sm font-semibold text-slate-900">{user.name}</span>
              </div>
            </div>

            {/* Field: Email Address */}
            <div className="flex items-start gap-3.5 p-4 bg-slate-50/60 border border-slate-100 rounded-xl">
              <Mail size={20} className="text-slate-400 mt-0.5 shrink-0" />
              <div className="overflow-hidden">
                <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Email Address</span>
                <span className="text-sm font-medium text-slate-800 font-mono break-all">{user.email}</span>
              </div>
            </div>

            {/* Field: Access Clearance (Role) */}
            <div className="flex items-start gap-3.5 p-4 bg-slate-50/60 border border-slate-100 rounded-xl">
              {user.isAdmin ? (
                <ShieldAlert size={20} className="text-purple-500 mt-0.5 shrink-0" />
              ) : (
                <UserCheck size={20} className="text-indigo-500 mt-0.5 shrink-0" />
              )}
              <div>
                <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Access Authorization</span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider border mt-1 ${
                    user.isAdmin
                      ? "bg-purple-50 text-purple-700 border-purple-200"
                      : "bg-indigo-50 text-indigo-700 border-indigo-200"
                  }`}
                >
                  {user.isAdmin ? "System Admin" : "Standard User"}
                </span>
              </div>
            </div>

            {/* Field: Internal Record Identifier */}
            <div className="flex items-start gap-3.5 p-4 bg-slate-50/60 border border-slate-100 rounded-xl">
              <Hash size={20} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">System Identifier (ID)</span>
                <span className="text-sm font-mono text-slate-600 select-all">{user._id}</span>
              </div>
            </div>

            {/* Field: Creation Stamp */}
            <div className="flex items-start gap-3.5 p-4 bg-slate-50/60 border border-slate-100 rounded-xl md:col-span-2">
              <Calendar size={20} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Registration Timestamp</span>
                <span className="text-sm font-medium text-slate-800">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}