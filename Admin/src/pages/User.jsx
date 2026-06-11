import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eye, Trash2, ShieldAlert, UserCheck, Users as UsersIcon, Loader2 } from "lucide-react";
import api from "../services/api";

export default function Users() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH USERS
  // =========================
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/users?search=${search}`);
      setUsers(data.users || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // =========================
  // DELETE USER
  // =========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      const { data } = await api.delete(`/users/${id}`);
      alert(data.message);
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Delete failed");
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
            <div className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/60 rounded-xl shadow-2xs">
              <UsersIcon className="text-indigo-600 dark:text-indigo-400" size={22} />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold uppercase tracking-wide text-slate-900 dark:text-white">
              Users Portal
            </h1>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 uppercase font-black tracking-widest">
            Total Active Accounts: <span className="text-indigo-600 dark:text-indigo-400 font-black">{users.length}</span>
          </p>
        </div>

        {/* SEARCH BOX */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search accounts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/70 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* ========================================================
          DATA RENDER GRID
         ======================================================== */}
      {loading ? (
        /* LOADING STATE */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/70 rounded-2xl p-16 text-center flex flex-col items-center justify-center gap-3 shadow-2xs">
          <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400" size={32} />
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Syncing database records...
          </h2>
        </div>
      ) : users.length === 0 ? (
        /* EMPTY STATE */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/70 rounded-2xl p-16 text-center shadow-2xs">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            No matching users discovered
          </h2>
        </div>
      ) : (
        /* TABLE INTERFACE */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/70 rounded-2xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              
              {/* TABLE HEAD */}
              <thead className="bg-slate-50 border-b border-slate-200 dark:bg-slate-900/60 dark:border-slate-800">
                <tr>
                  <th className="p-4 text-left text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Name</th>
                  <th className="p-4 text-left text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Email Address</th>
                  <th className="p-4 text-left text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Security Access</th>
                  <th className="p-4 text-center text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Actions</th>
                </tr>
              </thead>

              {/* TABLE BODY */}
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors duration-150 group"
                  >
                    {/* User Name */}
                    <td className="p-4 text-sm font-bold text-slate-900 dark:text-white">
                      {user.name}
                    </td>

                    {/* Email */}
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400 font-mono break-all max-w-[280px]">
                      {user.email}
                    </td>

                    {/* Role Badge */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${ 
                          user.isAdmin 
                            ? "bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/40" 
                            : "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/40" 
                        }`}
                      >
                        {user.isAdmin ? (
                          <>
                            <ShieldAlert size={12} />
                            <span>Admin</span>
                          </>
                        ) : (
                          <>
                            <UserCheck size={12} />
                            <span>User</span>
                          </>
                        )}
                      </span>
                    </td>

                    {/* Action Row Buttons */}
                    <td className="p-4">
                      <div className="flex items-center gap-2 justify-center">
                        {/* View Button */}
                        <button
                          onClick={() => navigate(`/admin/users/${user._id}`)}
                          className="flex items-center gap-1.5 bg-white dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-2xs"
                          title="View Details"
                        >
                          <Eye size={14} />
                          <span>View</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-2xs"
                          title="Terminate Account"
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
      )}

    </div>
  );
}