import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/Navbar";

export default function UserDetails() {

  const { id } =
    useParams();

  const [user, setUser] =
    useState(null);

  // =========================
  // FETCH USER
  // =========================
  const fetchUser =
    async () => {

      try {

        const { data } =
          await api.get(
            `/users/${id}`
          );

        setUser(data.user);

      } catch (error) {

        console.log(error);
      }
    };

  useEffect(() => {

    fetchUser();

  }, []);

  if (!user) {

    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  return (

    <div className="p-10">
{/* <Navbar /> */}
      <h1 className="text-3xl mt-5 font-bold mb-8">
        User Details
      </h1>

      <div className="bg-white shadow rounded-lg p-8 space-y-4">

        <div>
          <span className="font-bold">
            Name:
          </span>{" "}
          {user.name}
        </div>

        <div>
          <span className="font-bold">
            Email:
          </span>{" "}
          {user.email}
        </div>

        <div>
          <span className="font-bold">
            Role:
          </span>{" "}
          {
            user.isAdmin
              ? "Admin"
              : "User"
          }
        </div>

        <div>
          <span className="font-bold">
            User ID:
          </span>{" "}
          {user._id}
        </div>

        <div>
          <span className="font-bold">
            Joined:
          </span>{" "}
          {
            new Date(
              user.createdAt
            ).toLocaleDateString()
          }
        </div>

      </div>

    </div>
  );
}