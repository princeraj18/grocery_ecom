import {
  useEffect,
  useState,
} from "react";

import api from "../services/api";

import {
  useNavigate,
} from "react-router-dom";

export default function Users() {

  const navigate =
    useNavigate();

  const [users, setUsers] =
    useState([]);

  const [search, setSearch] =
    useState("");

  // =========================
  // FETCH USERS
  // =========================
  const fetchUsers =
    async () => {

      try {

        const { data } =
          await api.get(
            `/users?search=${search}`
          );

        setUsers(data.users);

      } catch (error) {

        console.log(error);
      }
    };

  useEffect(() => {

    fetchUsers();

  }, [search]);

  // =========================
  // DELETE USER
  // =========================
  const handleDelete =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this user?"
        );

      if (!confirmDelete)
        return;

      try {

        const { data } =
          await api.delete(
            `/users/${id}`
          );

        alert(data.message);

        // REFRESH USERS
        fetchUsers();

      } catch (error) {

        console.log(error);

        alert(
          error.response?.data
            ?.message ||
            "Delete failed"
        );
      }
    };

  return (

    <div className="p-10">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Users
        </h1>

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="border p-3 rounded-lg w-72"
        />

      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">

        <table className="w-full">

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

              <th className="p-4 text-left">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {
              users.map((user) => (

                <tr
                  key={user._id}
                  className="border-b"
                >

                  <td className="p-4">
                    {user.name}
                  </td>

                  <td className="p-4">
                    {user.email}
                  </td>

                  <td className="p-4">

                    {
                      user.isAdmin
                        ? "Admin"
                        : "User"
                    }

                  </td>

                  <td className="p-4 flex gap-3">

                    {/* VIEW */}
                    <button
                      onClick={() =>
                        navigate(
                          `/admin/users/${user._id}`
                        )
                      }
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      View
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() =>
                        handleDelete(
                          user._id
                        )
                      }
                      className="bg-red-600 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              ))
            }

          </tbody>

        </table>

      </div>

    </div>
  );
}