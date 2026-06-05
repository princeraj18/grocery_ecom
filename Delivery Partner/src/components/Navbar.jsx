import React, { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Get delivery partner data from localStorage
  const deliveryPartner = JSON.parse(
    localStorage.getItem('deliveryPartner')
  );

  // Generate initials
  const getInitials = (name) => {
    if (!name) return 'DP';

    const nameParts = name.trim().split(' ');

    if (nameParts.length === 1) {
      return nameParts[0][0].toUpperCase();
    }

    return (
      nameParts[0][0] +
      nameParts[nameParts.length - 1][0]
    ).toUpperCase();
  };

  const initials = getInitials(deliveryPartner?.name);

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-wider text-orange-500">
              Grocify
            </span>

            <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full font-medium">
              Partner
            </span>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center space-x-4">

            <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Online
            </div>

            {/* Profile Circle */}
            <div
              className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white cursor-pointer uppercase shadow-md"
              title={deliveryPartner?.name}
            >
              {initials}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-800 px-4 pt-2 pb-4 space-y-3">

          <div className="flex items-center justify-between pt-2 border-t border-slate-700">

            <span className="text-sm text-emerald-400">
              Status: Online
            </span>

            <div
              className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white uppercase"
              title={deliveryPartner?.name}
            >
              {initials}
            </div>

          </div>
        </div>
      )}
    </nav>
  );
}