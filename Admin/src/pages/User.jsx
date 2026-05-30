import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

      const { data } = await api.get(
        `/users?search=${search}`
      );

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
      const { data } = await api.delete(
        `/users/${id}`
      );

      alert(data.message);

      fetchUsers();
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Delete failed"
      );
    }
  };

  return (
    <div className="p-4 md:p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Users
          </h1>

          <p className="text-gray-500 mt-1">
            Total Users: {users.length}
          </p>
        </div>

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="border border-gray-300 rounded-xl px-4 py-3 w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-black"
        />

      </div>

      {/* LOADING */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow p-10 text-center">
          <h2 className="text-xl font-semibold">
            Loading Users...
          </h2>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-10 text-center">
          <h2 className="text-xl font-semibold">
            No Users Found
          </h2>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow overflow-hidden">

          {/* TABLE */}
          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="bg-black text-white">

                <tr>
                  <th className="p-4 text-left">
                    Name
                  </th>

                  <th className="p-4 text-left">
                    Email
                  </th>

                  <th className="p-4 text-left">
                    Role
                  </th>

                  <th className="p-4 text-center">
                    Actions
                  </th>
                </tr>

              </thead>

              <tbody>

                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b hover:bg-gray-50 transition"
                  >

                    <td className="p-4 font-medium">
                      {user.name}
                    </td>

                    <td className="p-4 text-gray-600 break-all">
                      {user.email}
                    </td>

                    <td className="p-4">

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          user.isAdmin
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {user.isAdmin
                          ? "Admin"
                          : "User"}
                      </span>

                    </td>

                    <td className="p-4">

                      <div className="flex flex-col sm:flex-row gap-2 justify-center">

                        <button
                          onClick={() =>
                            navigate(
                              `/admin/users/${user._id}`
                            )
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                        >
                          View
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              user._id
                            )
                          }
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                        >
                          Delete
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