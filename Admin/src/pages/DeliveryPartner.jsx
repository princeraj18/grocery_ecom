import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserCheck,
  Truck,
  Search,
  Eye,
  MapPin,
  Phone,
  CircleDot
} from "lucide-react";
import api from "../services/api";

const DeliveryPartner = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await api.get("/admin/delivery-dashboard");;
        if (response.data?.success) {
setPartners(
  response.data.dashboard?.topPartners || []
);        }
      } catch (error) {
        console.error("Error fetching delivery partners:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

const filteredPartners = partners.filter((partner) => {
  const search = searchTerm.trim().toLowerCase();

  return (
    partner?.name?.toLowerCase().includes(search) ||
    partner?.email?.toLowerCase().includes(search) ||
    partner?.phone?.toLowerCase().includes(search) ||
    partner?.vehicleType?.toLowerCase().includes(search) ||
    partner?.address?.toLowerCase().includes(search)
  );
});

  const activePartners = partners.filter(p => p.isAvailable).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Delivery Fleet</h1>
          <p className="text-slate-500 mt-1">Manage and monitor your active delivery workforce.</p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/3 -translate-y-1/2 text-slate-400 h-5 w-5" />
         <input
  type="text"
  placeholder="Search by name, email, phone, vehicle..."
  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm shadow-sm"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>

<p className="text-sm text-slate-500 mt-2">
  {filteredPartners.length} partner(s) found
</p>
        </div>
      </div>

      {/* Metrics Dashboard Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total Fleet Size</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{partners.length}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Available Partners</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{activePartners}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <CircleDot className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">On-Duty Load</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">
              {partners.reduce((acc, curr) => acc + (curr.currentOrders?.length || 0), 0)} Active Orders
            </h3>
          </div>
        </div>
      </div>

      {/* Fleet Cards Grid */}
      {filteredPartners.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
          <p className="text-slate-500 font-medium">No delivery partners match your structural scope.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPartners.map((partner) => (
            <div
              key={partner._id}
              onClick={() => navigate(`/admin/delivery-partners/${partner._id}`)}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col overflow-hidden cursor-pointer"
            >
              {/* Status Header Top Strip */}
              <div className="px-6 pt-6 flex justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0">
                    {partner.profileImage ? (
                      <img src={partner.profileImage} alt={partner.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-slate-400 bg-slate-100 uppercase">
                        {partner.name.slice(0, 2)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 line-clamp-1">{partner.name}</h4>
                    <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                      {partner.vehicleType}
                    </span>
                  </div>
                </div>

                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${partner.isAvailable
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-rose-50 text-rose-700 border border-rose-100"
                  }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${partner.isAvailable ? "bg-emerald-500" : "bg-rose-500"}`} />
                  {partner.isAvailable ? "Available" : "Busy"}
                </span>
              </div>

              {/* Quick Details Body */}
              <div className="p-6 flex-grow border-b border-slate-50 space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span>{partner.phone}</span>
                </div>
                {partner.address && (
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <MapPin className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-1">{partner.address}</span>
                  </div>
                )}

                {/* Micro-load indicator */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Current Load:</span>
                  <span className="font-semibold text-slate-700">{partner.currentOrders?.length || 0} / {partner.maxOrders || 10} Orders</span>
                </div>
              </div>

              {/* Action Bar footer */}
              <div className="px-6 py-4 bg-slate-50/50 flex justify-end">
                <button
                  onClick={() => navigate(`/admin/delivery-partners/${partner._id}`)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  View Management Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryPartner;