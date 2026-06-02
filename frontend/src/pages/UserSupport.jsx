import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

const UserSupport = () => {

  const [supports, setSupports] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // =====================================
  // FETCH SUPPORTS
  // =====================================
  const fetchSupports =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const { data } =
          await axios.get(
            "http://localhost:5000/api/contact/my-supports",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setSupports(
          data.contacts
        );

      } catch (error) {

        console.log(error);

        alert(
          "Failed to load supports"
        );

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {

    fetchSupports();

  }, []);

  // =====================================
  // LOADING
  // =====================================
  if (loading) {

    return (

      <div className="flex items-center justify-center min-h-screen text-xl font-semibold">
        Loading...
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gray-100 p-4 md:p-6">

      {/* HEADER */}

      <div className="mb-6">

        <h1 className="text-3xl font-bold">
          My Support Requests
        </h1>

        <p className="text-gray-500 mt-2">
          View your queries and admin replies
        </p>

      </div>

      {/* EMPTY */}

      {supports.length === 0 && (

        <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-500">
          No support requests found
        </div>
      )}

      {/* SUPPORTS */}

      <div className="space-y-6">

        {supports.map((item) => (

          <div
            key={item._id}
            className="bg-white rounded-2xl shadow p-6"
          >

            {/* TOP */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div>

                <h2 className="text-2xl font-bold">
                  {item.subject}
                </h2>

                <p className="text-gray-500 mt-2">
                  {new Date(
                    item.createdAt
                  ).toLocaleString()}
                </p>

              </div>

              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold w-fit ${
                  item.status ===
                  "Resolved"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {item.status}
              </span>

            </div>

            {/* MESSAGE */}

            <div className="mt-6">

              <h3 className="font-bold text-lg mb-2">
                Your Message
              </h3>

              <div className="bg-gray-50 rounded-xl p-4 text-gray-700 whitespace-pre-wrap">
                {item.message}
              </div>

            </div>

            {/* ADMIN REPLY */}

            <div className="mt-6">

              <h3 className="font-bold text-lg mb-2">
                Admin Reply
              </h3>

              {item.adminReply ? (

                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-gray-700 whitespace-pre-wrap">
                  {item.adminReply}
                </div>

              ) : (

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-yellow-700">
                  Waiting for admin reply...
                </div>

              )}

            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default UserSupport;