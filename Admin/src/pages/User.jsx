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
      console.log(error);
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
      console.log(error);
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="min-h-full  bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-6 space-y-6">

      {/* ========================================================
          HEADER SECTION
         ======================================================== */}
      <div className="flex flex-col dark:bg-slate-900/20 md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-xl p-2 items-center gap-2.5">
            <UsersIcon className="text-indigo-600" size={24} />
            <h1 className="text-2xl md:text-3xl font-extrabold uppercase tracking-wide text-slate-900 dark:text-white">
              Users Portal
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase font-bold tracking-widest">
            Total Active Accounts: <span className="text-indigo-600 font-black">{users.length}</span>
          </p>
        </div>

        {/* SEARCH BOX */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search accounts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* ========================================================
          DATA RENDER GRID
         ======================================================== */}
      {loading ? (
        /* LOADING STATE */
        <div className="bg-white  dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-16 text-center flex flex-col items-center justify-center gap-3 shadow-sm">
          <Loader2 className="animate-spin text-indigo-600" size={32} />
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Syncing database records...
          </h2>
        </div>
      ) : users.length === 0 ? (
        /* EMPTY STATE */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-16 text-center shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">
            No matching users discovered
          </h2>
        </div>
      ) : (
        /* TABLE INTERFACE */
        <div className="bg-white  dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto dark:bg-slate-900/20">
            <table className="min-w-full dark:bg-slate-900/20 border-collapse">
              
              {/* TABLE HEAD */}
              <thead className="bg-slate-100/70 border-b border-slate-200 dark:bg-black dark:border-slate-800">
                <tr>
                  <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Name</th>
                  <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Email Address</th>
                  <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Security Access</th>
                  <th className="p-4 text-center text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Actions</th>
                </tr>
              </thead>

              {/* TABLE BODY */}
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-slate-800 dark:bg-slate-900/70 transition-colors group"
                  >
                    {/* User Name */}
                    <td className="p-4 text-sm font-semibold text-slate-900 dark:text-white">
                      {user.name}
                    </td>

                    {/* Email */}
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400 font-mono break-all">
                      {user.email}
                    </td>

                    {/* Role Badge */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${ user.isAdmin ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-indigo-50 text-indigo-700 border-indigo-200" }`}
                      >
                        {user.isAdmin ? (
                          <>
                            <ShieldAlert size={12} />
                            Admin
                          </>
                        ) : (
                          <>
                            <UserCheck size={12} />
                            User
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
                          className="flex items-center gap-1.5 bg-white dark:bg-slate-900 hover:bg-slate-50 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                          title="View Details"
                        >
                          <Eye size={14} />
                          <span>View</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
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