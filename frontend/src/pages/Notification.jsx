import React, {
  useEffect,
  useState,
} from "react";

import api from "../api/Axios";

import {
  FaBell,
} from "react-icons/fa";

export default function Notification() {

  const [
    notifications,
    setNotifications,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  // ===================================
  // FETCH NOTIFICATIONS
  // ===================================

  const fetchNotifications =
  async () => {

    try {

      const { data } =
        await api.get(
          "/notifications/my-notifications"
        );

      console.log(data);

      setNotifications(
        data.notifications || []
      );

    } catch (error) {

      console.log(
        error.response?.data || error
      );

    } finally {

      setLoading(false);
    }
  };

  // ===================================
  // MARK AS READ
  // ===================================

  const markAsRead =
    async (id) => {

      try {

        await api.put(
          `/notifications/read/${id}`
        );

        setNotifications(
          (prev) =>
            prev.map((item) =>
              item._id === id
                ? {
                    ...item,
                    isRead: true,
                  }
                : item
            )
        );

      } catch (error) {

        console.log(error);
      }
    };

  useEffect(() => {

    fetchNotifications();

  }, []);

  return (

    <div className="min-h-screen bg-gray-100 p-4 md:p-8">

      <div className="max-w-4xl mx-auto">

        {/* HEADER */}

        <div className="flex items-center gap-3 mb-8">

          <div className="bg-black text-white p-3 rounded-full">
            <FaBell size={20} />
          </div>

          <div>

            <h1 className="text-3xl font-bold">
              Notifications
            </h1>

            <p className="text-gray-500">
              Track your latest updates
            </p>

          </div>

        </div>

        {/* LOADING */}

        {loading ? (

          <div className="bg-white rounded-2xl shadow p-10 text-center">

            <p className="text-xl font-semibold animate-pulse">
              Loading Notifications...
            </p>

          </div>

        ) : notifications.length === 0 ? (

          <div className="bg-white rounded-2xl shadow p-10 text-center">

            <h2 className="text-2xl font-bold mb-2">
              No Notifications
            </h2>

            <p className="text-gray-500">
              You don't have any notifications yet.
            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {notifications.map(
              (notification) => (

                <div
                  key={
                    notification._id
                  }
                  className={`bg-white rounded-2xl shadow p-5 border-l-4 ${
                    notification.isRead
                      ? "border-gray-300"
                      : "border-green-500"
                  }`}
                >

                  <div className="flex justify-between gap-4">

                    <div>

                      <h2 className="font-bold text-lg">
                        {
                          notification.title
                        }
                      </h2>

                      <p className="text-gray-600 mt-1">
                        {
                          notification.message
                        }
                      </p>

                      <p className="text-xs text-gray-400 mt-3">
                        {new Date(
                          notification.createdAt
                        ).toLocaleString()}
                      </p>

                    </div>

                    {!notification.isRead && (

                      <button
                        onClick={() =>
                          markAsRead(
                            notification._id
                          )
                        }
                        className="bg-black text-white px-4 py-2 rounded-lg text-sm h-fit"
                      >
                        Mark Read
                      </button>
                    )}

                  </div>

                </div>
              )
            )}

          </div>
        )}

      </div>

    </div>
  );
}