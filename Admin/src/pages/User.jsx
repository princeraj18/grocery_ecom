import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import api from "../services/api";

export default function User() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] =
    useState(true);

  // fetch users
  useEffect(() => {

    const fetchUsers = async () => {

      try {

        const { data } =
          await api.get("/admin/users");

        setUsers(data.users || []);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }
    };

    fetchUsers();

  }, []);

  // delete user
  const deleteUser = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this user?"
      );

    if (!confirmDelete) return;

    try {

      await api.delete(
        `/admin/users/${id}`
      );

      setUsers(
        users.filter(
          (user) => user._id !== id
        )
      );

    } catch (error) {

      console.log(error);

      alert("Failed to delete user");

    }
  };

  return (
    <AdminLayout>

      <div className="flex items-center justify-between mb-6">

        <h1 className="text-3xl font-bold">
          Users
        </h1>

        <p className="text-gray-500">
          Total Users: {users.length}
        </p>

      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">

        {
          loading ? (

            <div className="p-6 text-center text-lg">
              Loading users...
            </div>

          ) : (

            <table className="w-full">

              <thead className="bg-gray-100">

                <tr>

                  <th className="text-left p-4">
                    ID
                  </th>

                  <th className="text-left p-4">
                    Name
                  </th>

                  <th className="text-left p-4">
                    Email
                  </th>

                  <th className="text-left p-4">
                    Role
                  </th>

                  <th className="text-left p-4">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {
                  users.length > 0 ? (

                    users.map((user) => (

                      <tr
                        key={user._id}
                        className="border-t hover:bg-gray-50"
                      >

                        <td className="p-4">
                          {user._id.slice(0, 8)}...
                        </td>

                        <td className="p-4">
                          {user.name}
                        </td>

                        <td className="p-4">
                          {user.email}
                        </td>

                        <td className="p-4">
                          <span className="bg-black text-white px-3 py-1 rounded-full text-sm">
                            {user.role || "user"}
                          </span>
                        </td>

                        <td className="p-4">

                          <button
                            onClick={() =>
                              deleteUser(
                                user._id
                              )
                            }
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                          >
                            Delete
                          </button>

                        </td>

                      </tr>
                    ))
                  ) : (

                    <tr>

                      <td
                        colSpan="5"
                        className="text-center p-6 text-gray-500"
                      >
                        No users found
                      </td>

                    </tr>
                  )
                }

              </tbody>

            </table>
          )
        }

      </div>

    </AdminLayout>
  );
}