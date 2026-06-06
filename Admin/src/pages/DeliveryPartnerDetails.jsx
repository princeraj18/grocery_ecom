import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Wallet, 
  PieChart, 
  CheckCircle, 
  XCircle, 
  Truck, 
  Mail, 
  Phone, 
  MapPin,
  ShieldCheck
} from "lucide-react";
import api from "../services/api";

const DeliveryPartnerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPartnerDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/admin/delivery-partners/${id}`);
        if (response.data?.success) {
          setPartner(response.data.partner);
        } else if (response.data?.partner) {
          setPartner(response.data.partner);
        }
      } catch (err) {
        console.error("Error fetching delivery partner details:", err);
        setError(err.response?.data?.message || "Failed to fetch delivery partner details");
      } finally {
        setLoading(false);
      }
    };
    fetchPartnerDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
        <button onClick={() => navigate(-1)} className="mt-4 text-indigo-600 inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p className="font-bold">Delivery Partner Not Found</p>
          <p>The requested delivery partner could not be found.</p>
        </div>
        <button onClick={() => navigate(-1)} className="mt-4 text-indigo-600 inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  // Acceptance logic mirrors architecture setup in controller configuration
  const totalResponses = (partner.totalAcceptedOrders || 0) + (partner.totalRejectedOrders || 0);
  const acceptanceRate = totalResponses === 0 ? 0 : Math.round((partner.totalAcceptedOrders / totalResponses) * 100);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      {/* Navigation Return Hook */}
      <button 
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Delivery Fleet List
      </button>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Card Summary Panel */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col items-center text-center h-fit">
          <div className="relative">
            <div className="h-28 w-28 rounded-full bg-slate-100 border-2 border-indigo-500 overflow-hidden mb-4">
              {partner.profileImage ? (
                <img src={partner.profileImage} alt={partner.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-3xl text-slate-400 bg-slate-100 uppercase">
                  {partner.name.slice(0, 2)}
                </div>
              )}
            </div>
            <span className={`absolute bottom-5 right-2 h-4 w-4 rounded-full border-2 border-white ${partner.isAvailable ? "bg-emerald-500" : "bg-amber-500"}`} />
          </div>

          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            {partner.name}
            {partner.isVerified && <ShieldCheck className="w-5 h-5 text-indigo-600 fill-indigo-50 font-semibold" />}
          </h2>
          <p className="text-sm font-medium text-indigo-600 mt-0.5 capitalize">{partner.role}</p>

          <div className="w-full border-t border-slate-100 my-6 pt-6 space-y-4 text-left">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <span className="break-all">{partner.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <span>{partner.phone}</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-slate-600">
              <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <span>{partner.address || "No baseline address set"}</span>
            </div>
          </div>
        </div>

        {/* Analytical and Detailed Field Matrix Grid Blocks */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Earnings Overview Ledger Block */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Wallet className="h-5 w-5 text-slate-500" />
              Wallet & Earnings Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Wallet Balance</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">₹{partner.walletBalance || 0}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Earnings</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">₹{partner.earnings || 0}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Withdrawn Amount</p>
                <p className="text-2xl font-bold text-slate-500 mt-1">₹{partner.withdrawnAmount || 0}</p>
              </div>
            </div>
          </div>

          {/* Operational Metrics and Logs Overview Block */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <PieChart className="h-5 w-5 text-slate-500" />
              Performance Performance Log Data
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Acceptance Rate</p>
                  <p className="text-2xl font-bold text-indigo-600 mt-1">{acceptanceRate}%</p>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Accepted Trips</p>
                  <p className="text-xl font-bold text-slate-800 mt-0.5">{partner.totalAcceptedOrders || 0}</p>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                <div className="p-2 bg-rose-100 text-rose-700 rounded-lg">
                  <XCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Declined Orders</p>
                  <p className="text-xl font-bold text-slate-800 mt-0.5">{partner.totalRejectedOrders || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Transportation Metadata Logistics Box */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Truck className="h-5 w-5 text-slate-500" />
              Vehicle Configuration Assets
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Vehicle Class Type</label>
                <p className="text-base font-semibold text-slate-700 mt-1 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
                  {partner.vehicleType || "Unassigned"}
                </p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">License Registration Identifier</label>
                <p className="text-base font-semibold text-slate-700 mt-1 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 uppercase tracking-wide">
                  {partner.vehicleNumber || "No plate context data provided"}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DeliveryPartnerDetails;