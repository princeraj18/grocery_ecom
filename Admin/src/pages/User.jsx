/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import api from "../services/api";

export default function User() {

  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // FETCH USERS
  useEffect(() => {

    const fetchUsers =
      async () => {

        try {

          const { data } =
            await api.get(
              "/admin/users"
            );

          setUsers(
            data.users || []
          );

        } catch (error) {

          console.log(error);

        } finally {

          setLoading(false);
        }
      };

    fetchUsers();

  }, []);

  // DELETE USER
  const deleteUser =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this user?"
        );

      if (!confirmDelete) return;

      try {

        await api.delete(
          `/admin/users/${id}`
        );

        setUsers(
          users.filter(
            (user) =>
              user._id !== id
          )
        );

      } catch (error) {

        console.log(error);

        alert(
          "Failed to delete user"
        );
      }
    };

  return (
    <div>

      <div className="flex items-center justify-between mb-6">

        <h1 className="text-3xl font-bold">
          Users
        </h1>

        <p className="text-gray-500">
          Total Users:
          {" "}
          {users.length}
        </p>

      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">

        {
          loading ? (

            <div className="p-6 text-center">
              Loading users...
            </div>

          ) : (

            <table className="w-full">

              <thead className="bg-gray-100">

                <tr>

                  <th className="p-4 text-left">
                    ID
                  </th>

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
                  users.length > 0 ? (

                    users.map((user) => (

                      <tr
                        key={user._id}
                        className="border-t"
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
                          {user.role}
                        </td>

                        <td className="p-4">

                          <button
                            onClick={() =>
                              deleteUser(
                                user._id
                              )
                            }
                            className="bg-red-500 text-white px-4 py-2 rounded"
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
                        className="text-center p-6"
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

    </div>
  );
}