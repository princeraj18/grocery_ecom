import { useState } from "react";
import { Menu, X } from "lucide-react";

import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    /* FIXED: Changed min-h-screen to h-screen & hidden body window scroll overflow */
    <div className="flex h-screen w-screen bg-gray-100 overflow-hidden select-none">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR WRAPPER */}
      <div
        className={`
          fixed lg:static
          z-50
          h-full
          /* FIXED: Adjusted width to w-80 (320px) to match the new dual-sidebar dimensions */
          w-80 
          shrink-0
          bg-black
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

      {/* MAIN CONTENT AREA */}
      {/* FIXED: Added h-full and overflow-hidden to lock down outer grid stretching */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">

        {/* TOPBAR */}
        <div className="sticky top-0 bg-white shadow z-30 shrink-0">
          <div className="flex items-center">
            
            {/* Mobile Toggle Button */}
            <button
              className="lg:hidden p-4 text-black hover:bg-gray-100 transition"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="flex-1">
              <Navbar />
            </div>

          </div>
        </div>

        {/* PAGE CONTENT PANEL */}
        {/* FIXED: Explicitly set overflow-y-auto to isolated internal child canvas */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          {children}
        </main>

      </div>

    </div>
  );
}