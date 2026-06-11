import React, { useEffect, useState, useMemo } from "react";
import api from "../api/Axios";
import { FaBell, FaCheck, FaRegBell, FaInbox, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Tab Filter States: "all" | "unread" | "read"
  const [activeFilter, setActiveFilter] = useState("all");

  // ===================================
  // FETCH NOTIFICATIONS
  // ===================================
  const fetchNotifications = async () => {
    try {
      const { data } = await api.get("/notifications/my-notifications");
      setNotifications(data.notifications || []);
    } catch (error) {
      console.log(error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  // ===================================
  // MARK AS READ
  // ===================================
  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/read/${id}`);
      setNotifications((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isRead: true } : item
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // ===================================
  // COMPUTED COUNTS & FILTERED LIST
  // ===================================
  const counts = useMemo(() => {
    return {
      all: notifications.length,
      unread: notifications.filter((n) => !n.isRead).length,
      read: notifications.filter((n) => n.isRead).length,
    };
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "unread") return notifications.filter((n) => !n.isRead);
    if (activeFilter === "read") return notifications.filter((n) => n.isRead);
    return notifications;
  }, [notifications, activeFilter]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400">
            <FaBell className="text-base" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight sm:text-2xl">
              Notifications
            </h1>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">
              Track your latest updates and account history
            </p>
          </div>
        </div>

        {/* FUNCTIONAL FILTER TABS */}
        <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-3 mb-6 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveFilter("all")}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              activeFilter === "all"
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
            }`}
          >
            <FaInbox className="text-[11px]" />
            <span>All</span>
            <span className={`px-1.5 py-0.5 text-[10px] rounded-md ${activeFilter === "all" ? "bg-slate-700 text-slate-200 dark:bg-slate-200 dark:text-slate-700" : "bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}>
              {counts.all}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter("unread")}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              activeFilter === "unread"
                ? "bg-[#0c831f] text-white dark:bg-emerald-600 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
            }`}
          >
            <FaEyeSlash className="text-[11px]" />
            <span>Unread</span>
            {counts.unread > 0 && (
              <span className={`px-1.5 py-0.5 text-[10px] rounded-md font-black ${activeFilter === "unread" ? "bg-emerald-800 text-emerald-100 dark:bg-emerald-500 dark:text-white" : "bg-emerald-100 dark:bg-emerald-950 text-[#0c831f] dark:text-emerald-400"}`}>
                {counts.unread}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveFilter("read")}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              activeFilter === "read"
                ? "bg-slate-400 text-white dark:bg-slate-700 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
            }`}
          >
            <FaEye className="text-[11px]" />
            <span>Read</span>
            <span className={`px-1.5 py-0.5 text-[10px] rounded-md ${activeFilter === "read" ? "bg-slate-500 dark:bg-slate-600 text-slate-100" : "bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}>
              {counts.read}
            </span>
          </button>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex flex-col items-center justify-center border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-12 text-center shadow-sm">
            <div className="h-7 w-7 border-2 border-slate-300 border-t-[#0c831f] dark:border-t-emerald-500 rounded-full animate-spin mb-3" />
            <p className="text-sm font-bold text-slate-400 dark:text-slate-500">
              Loading your inbox...
            </p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          /* EMPTY FALLBACK */
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-12 text-center shadow-sm transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-950 text-slate-300 dark:text-slate-700 mx-auto mb-4">
              <FaRegBell size={22} />
            </div>
            <h2 className="text-base font-black mb-1">
              {activeFilter === "all" && "Inbox is empty"}
              {activeFilter === "unread" && "No unread alerts"}
              {activeFilter === "read" && "No read notifications"}
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {activeFilter === "all" && "You don't have any notifications right now."}
              {activeFilter === "unread" && "You're all caught up with your updates!"}
              {activeFilter === "read" && "Items you review will be logged right here."}
            </p>
          </div>
        ) : (
          /* NOTIFICATIONS INTERFACE */
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm divide-y divide-slate-100 dark:divide-slate-800/60 transition-all">
            {filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`group flex items-start gap-4 p-4 transition-colors duration-150 ${
                  notification.isRead
                    ? "bg-white dark:bg-slate-900 opacity-75 hover:opacity-100"
                    : "bg-emerald-50/30 dark:bg-emerald-950/10"
                }`}
              >
                {/* STATUS INDICATOR DOT */}
                <div className="flex pt-1 shrink-0">
                  <span
                    className={`h-2 w-2 rounded-full transition-all ${
                      notification.isRead
                        ? "bg-transparent"
                        : "bg-[#0c831f] dark:bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-950/50 animate-pulse"
                    }`}
                  />
                </div>

                {/* CONTENT LAYER */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h2
                      className={`text-sm tracking-tight ${
                        notification.isRead
                          ? "font-semibold text-slate-700 dark:text-slate-300"
                          : "font-black text-slate-900 dark:text-white"
                      }`}
                    >
                      {notification.title}
                    </h2>
                    <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 whitespace-nowrap">
                      {new Date(notification.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                    {notification.message}
                  </p>
                </div>

                {/* ACTION BUTTON */}
                {!notification.isRead && (
                  <div className="shrink-0 pt-0.5">
                    <button
                      onClick={() => markAsRead(notification._id)}
                      title="Mark as read"
                      className="flex h-7 px-2.5 items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:border-[#0c831f] hover:bg-emerald-50 hover:text-[#0c831f] dark:hover:border-emerald-500 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400 transition-all shadow-sm active:scale-95"
                    >
                      <FaCheck className="text-[9px]" />
                      <span>Read</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}