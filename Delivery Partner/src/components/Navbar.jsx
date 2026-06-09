import React from 'react';
import { Circle, Bike } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  // Get delivery partner data
  const deliveryPartner = JSON.parse(localStorage.getItem('deliveryPartner'));

  const getInitials = (name) => {
    if (!name) return 'GP';
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) return nameParts[0][0].toUpperCase();
    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(deliveryPartner?.name);

  return (
    <nav className="bg-white border-b border-gray-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white h-16 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8 font-poppins">
      
      {/* LEFT: Grocify Branding & Status Indicator */}
      <div className="flex items-center gap-6">
        {/* Grocify Partner Brand Logo */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-600 rounded-lg text-white">
            <Bike size={18} className="-scale-x-100" />
          </div>
          <div className="leading-none">
            <span className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Grocify
            </span>
            <span className="block text-[9px] font-bold uppercase tracking-widest text-emerald-600">
              Partner
            </span>
          </div>
        </div>

        {/* Vertical Separator for Desktop */}
        <div className="hidden sm:block h-6 w-px bg-gray-200" />
        
        {/* Online Status Indicator */}
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200/40">
          <Circle size={8} className="fill-emerald-500 text-emerald-500 animate-pulse" />
          <span>Online</span>
        </div>
      </div>

      {/* RIGHT: User Profile Configuration */}
      <div className="flex items-center gap-3.5">
        <ThemeToggle />

        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wide">
            {deliveryPartner?.name || "Grocify Driver"}
          </p>
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
            ID: {deliveryPartner?.id || deliveryPartner?._id?.slice(-6).toUpperCase() || "ACTIVE"}
          </p>
        </div>
        
        {/* Initials Avatar Badge */}
        <div className="h-9 w-9 rounded-xl bg-slate-950 flex items-center justify-center font-bold text-white shadow-md shadow-slate-950/10 uppercase text-xs tracking-wider">
          {initials}
        </div>
      </div>
    </nav>
  );
}