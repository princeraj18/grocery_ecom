import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  Bike,
  Wallet,
  IndianRupee,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  User,
  Calendar,
  Package,
} from "lucide-react";

const money = (value = 0) =>
  `₹ ${Number(value || 0).toLocaleString("en-IN")}`;

export default function DeliveryPartner() {

  const [partners, setPartners] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedPartner, setSelectedPartner] =
    useState(null);

  const [detailsOpen, setDetailsOpen] =
    useState(false);

  // =====================================
  // FETCH DELIVERY PARTNERS
  // =====================================

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "adminToken"
          );

        const res =
          await axios.get(
            "http://localhost:5000/api/admin/delivery-partners/dashboard",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        if (
          res.data?.success
        ) {

          setPartners(
            res.data.partners || []
          );
        }

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (
      <div className="p-6  text-xl">
        Loading delivery partners...
      </div>
    );
  }

  // =====================================
  // STATS
  // =====================================

  const totalPartners =
    partners?.length || 0;

  const availablePartners =
    partners.filter(
      (p) => p?.isAvailable
    ).length;

  const busyPartners =
    partners.filter(
      (p) => !p?.isAvailable
    ).length;

  const totalEarnings =
    partners.reduce(
      (acc, item) =>
        acc +
        (item?.totalEarnings || 0),
      0
    );

  const totalWallet =
    partners.reduce(
      (acc, item) =>
        acc +
        (item?.walletBalance || 0),
      0
    );

  return (

    <div className="space-y-6 p-6 bg-slate-950 min-h-screen text-white">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div>

        <h1 className="text-3xl font-bold">
          Delivery Partners
        </h1>

        <p className="text-slate-400 mt-1">
          Manage all registered delivery partners
        </p>

      </div>

      {/* ================================= */}
      {/* STATS */}
      {/* ================================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">

        {/* TOTAL */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

          <p className="text-slate-400 text-sm">
            Total Partners
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {totalPartners}
          </h2>

        </div>

        {/* AVAILABLE */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

          <p className="text-slate-400 text-sm">
            Available
          </p>

          <h2 className="text-3xl font-bold text-emerald-400 mt-2">
            {availablePartners}
          </h2>

        </div>

        {/* BUSY */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

          <p className="text-slate-400 text-sm">
            Busy
          </p>

          <h2 className="text-3xl font-bold text-red-400 mt-2">
            {busyPartners}
          </h2>

        </div>

        {/* EARNINGS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

          <p className="text-slate-400 text-sm">
            Total Earnings
          </p>

          <h2 className="text-2xl font-bold text-yellow-400 mt-2">
            {money(totalEarnings)}
          </h2>

        </div>

        {/* WALLET */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

          <p className="text-slate-400 text-sm">
            Wallet Balance
          </p>

          <h2 className="text-2xl font-bold text-cyan-400 mt-2">
            {money(totalWallet)}
          </h2>

        </div>

      </div>

      {/* ================================= */}
      {/* TABLE */}
      {/* ================================= */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-800">

              <tr>

                <th className="text-left p-4 text-slate-300">
                  Partner
                </th>

                <th className="text-left p-4 text-slate-300">
                  Vehicle
                </th>

                <th className="text-left p-4 text-slate-300">
                  Active Orders
                </th>

                <th className="text-left p-4 text-slate-300">
                  Wallet
                </th>

                <th className="text-left p-4 text-slate-300">
                  Earnings
                </th>

                <th className="text-left p-4 text-slate-300">
                  Withdrawn
                </th>

                <th className="text-left p-4 text-slate-300">
                  Status
                </th>

                <th className="text-left p-4 text-slate-300">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {partners.length === 0 ? (

                <tr>

                  <td
                    colSpan="8"
                    className="text-center p-6 text-slate-400"
                  >
                    No delivery partners found
                  </td>

                </tr>

              ) : (

                partners.map(
                  (partner) => (

                    <tr
                      key={
                        partner._id
                      }
                      className="border-t border-slate-800 hover:bg-slate-800/40 transition"
                    >

                      {/* PARTNER */}
                      <td className="p-4">

                        <div className="flex items-center gap-3">

                          <img
                            src={
                              partner.profileImage ||
                              "https://ui-avatars.com/api/?name=Delivery+Partner"
                            }
                            alt=""
                            className="w-12 h-12 rounded-full object-cover"
                          />

                          <div>

                            <h2 className="font-semibold">
                              {
                                partner.name
                              }
                            </h2>

                            <div className="flex items-center gap-1 text-slate-400 text-sm">

                              <Mail size={14} />

                              {
                                partner.email
                              }

                            </div>

                            <div className="flex items-center gap-1 text-slate-400 text-sm mt-1">

                              <Phone size={14} />

                              {
                                partner.phone
                              }

                            </div>

                          </div>

                        </div>

                      </td>

                      {/* VEHICLE */}
                      <td className="p-4">

                        <div className="flex items-center gap-2 text-slate-300">

                          <Bike
                            size={18}
                          />

                          {
                            partner.vehicleType
                          }

                        </div>

                      </td>

                      {/* ACTIVE ORDERS */}
                      <td className="p-4 font-semibold">

                        {
                          partner
                            ?.currentOrders
                            ?.length || 0
                        }

                      </td>

                      {/* WALLET */}
                      <td className="p-4">

                        <div className="flex items-center gap-1 text-cyan-400 font-bold">

                          <Wallet
                            size={18}
                          />

                          {
                            money(
                              partner.walletBalance
                            )
                          }

                        </div>

                      </td>

                      {/* EARNINGS */}
                      <td className="p-4">

                        <div className="flex items-center gap-1 text-emerald-400 font-bold">

                          <IndianRupee
                            size={18}
                          />

                          {
                            money(
                              partner.totalEarnings
                            )
                          }

                        </div>

                      </td>

                      {/* WITHDRAWN */}
                      <td className="p-4 text-yellow-400 font-bold">

                        {
                          money(
                            partner.withdrawnAmount
                          )
                        }

                      </td>

                      {/* STATUS */}
                      <td className="p-4">

                        {partner.isAvailable ? (

                          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-sm">

                            <CheckCircle
                              size={16}
                            />

                            Available

                          </div>

                        ) : (

                          <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-sm">

                            <XCircle
                              size={16}
                            />

                            Busy

                          </div>

                        )}

                      </td>

                      {/* ACTION */}
                      <td className="p-4">

                        <button
                          onClick={() => {
                            setSelectedPartner(partner);
                            setDetailsOpen(true);
                          }}
                          className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm"
                        >
                          View
                        </button>

                      </td>

                    </tr>
                  )
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ================================= */}
      {/* DETAILS MODAL */}
      {/* ================================= */}

      {detailsOpen &&
        selectedPartner && (

          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">

            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl p-6 relative">

              {/* CLOSE */}
              <button
                onClick={() =>
                  setDetailsOpen(false)
                }
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl"
              >
                ✕
              </button>

              {/* HEADER */}
              <div className="flex items-center gap-4 mb-6">

                <img
                  src={
                    selectedPartner.profileImage ||
                    "https://ui-avatars.com/api/?name=Partner"
                  }
                  alt=""
                  className="w-20 h-20 rounded-full object-cover"
                />

                <div>

                  <h2 className="text-2xl font-bold">
                    {
                      selectedPartner.name
                    }
                  </h2>

                  <p className="text-slate-400">
                    {
                      selectedPartner.email
                    }
                  </p>

                </div>

              </div>

              {/* DETAILS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <DetailCard
                  icon={<Phone size={18} />}
                  label="Phone"
                  value={
                    selectedPartner.phone
                  }
                />

                <DetailCard
                  icon={<Bike size={18} />}
                  label="Vehicle Type"
                  value={
                    selectedPartner.vehicleType
                  }
                />

                <DetailCard
                  icon={<User size={18} />}
                  label="Vehicle Number"
                  value={
                    selectedPartner.vehicleNumber ||
                    "N/A"
                  }
                />

                <DetailCard
                  icon={<Package size={18} />}
                  label="Active Orders"
                  value={
                    selectedPartner
                      ?.currentOrders
                      ?.length || 0
                  }
                />

                <DetailCard
                  icon={<Wallet size={18} />}
                  label="Wallet Balance"
                  value={money(
                    selectedPartner.walletBalance
                  )}
                />

                <DetailCard
                  icon={
                    <IndianRupee size={18} />
                  }
                  label="Total Earnings"
                  value={money(
                    selectedPartner.totalEarnings
                  )}
                />

                <DetailCard
                  icon={<Wallet size={18} />}
                  label="Withdrawn Amount"
                  value={money(
                    selectedPartner.withdrawnAmount
                  )}
                />

                <DetailCard
                  icon={
                    <Calendar size={18} />
                  }
                  label="Joined"
                  value={new Date(
                    selectedPartner.createdAt
                  ).toLocaleDateString()}
                />

              </div>

            </div>

          </div>
        )}

    </div>
  );
}

// =====================================
// DETAIL CARD
// =====================================

function DetailCard({
  icon,
  label,
  value,
}) {

  return (

    <div className="bg-slate-800 rounded-xl p-4">

      <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">

        {icon}

        {label}

      </div>

      <div className="text-lg font-semibold">
        {value}
      </div>

    </div>
  );
}