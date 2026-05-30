import { useState } from "react";
import { Menu, X } from "lucide-react";

import SideBar from "../components/SideBar"
import Navbar from "../components/Navbar"

export default function AdminLayout({
  children,
}) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed lg:static
          z-50
          h-full
          w-72
          bg-white
          shadow-lg
          transition-transform duration-300
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <SideBar />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <div className="sticky top-0 bg-white shadow z-30">

          <div className="flex items-center">

            <button
              className="lg:hidden p-4"
              onClick={() =>
                setSidebarOpen(
                  !sidebarOpen
                )
              }
            >
              {sidebarOpen ? (
                <X size={28} />
              ) : (
                <Menu size={28} />
              )}
            </button>

            <div className="flex-1">
              <Navbar />
            </div>

          </div>

        </div>

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

      </div>

    </div>
  );
}