import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Vendors() {
  const navigate = useNavigate();

  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");

  const fetchVendors = async () => {
    try {
      const { data } = await api.get(
        `/admin/vendors?search=${encodeURIComponent(search)}`
      );

      setVendors(data.vendors || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [search]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this vendor?"
    );

    if (!confirmDelete) return;

    try {
      const { data } = await api.delete(
        `/admin/vendors/${id}`
      );

      alert(data.message || "Vendor deleted");

      fetchVendors();
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Delete failed"
      );
    }
  };

  const handleVerify = async (id) => {
    try {
      const { data } = await api.put(
        `/vendors/verify/${id}`
      );

      alert(
        data.message ||
          "Vendor verified successfully"
      );

      fetchVendors();
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Verification failed"
      );
    }
  };

  const handleUnverify = async (id) => {
    try {
      const { data } = await api.put(
        `/vendors/unverify/${id}`
      );

      alert(
        data.message ||
          "Vendor unverified"
      );

      fetchVendors();
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Unverify failed"
      );
    }
  };

  return (
    <div className="p-4 md:p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <h1 className="text-2xl md:text-3xl font-bold">
          Vendors
        </h1>

        <input
          type="text"
          placeholder="Search vendors..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="border p-3 rounded-lg w-full md:w-80"
        />
      </div>

      {/* MOBILE CARDS */}
      <div className="grid gap-4 md:hidden">

        {vendors.map((vendor) => (
          <div
            key={vendor._id}
            className="bg-white rounded-2xl shadow p-4"
          >
            <div className="flex justify-between items-start">

              <div>
                <h2 className="font-bold text-lg">
                  {vendor.shopName}
                </h2>

                <p className="text-gray-600">
                  {vendor.ownerName}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  vendor.isVerified
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {vendor.isVerified
                  ? "Verified"
                  : "Not Verified"}
              </span>
            </div>

            <div className="mt-3 space-y-1 text-sm">
              <p>
                <strong>Email:</strong>{" "}
                {vendor.email}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {vendor.phone}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">

              <button
                onClick={() =>
                  navigate(
                    `/admin/vendors/${vendor._id}`
                  )
                }
                className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm"
              >
                View
              </button>

              {!vendor.isVerified ? (
                <button
                  onClick={() =>
                    handleVerify(
                      vendor._id
                    )
                  }
                  className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm"
                >
                  Verify
                </button>
              ) : (
                <button
                  onClick={() =>
                    handleUnverify(
                      vendor._id
                    )
                  }
                  className="bg-yellow-500 text-white px-3 py-2 rounded-lg text-sm"
                >
                  Unverify
                </button>
              )}

              <button
                onClick={() =>
                  handleDelete(
                    vendor._id
                  )
                }
                className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block overflow-x-auto bg-white shadow rounded-xl">

        <table className="w-full min-w-[900px]">

          <thead className="bg-black text-white">

            <tr>
              <th className="p-4 text-left">
                Shop Name
              </th>

              <th className="p-4 text-left">
                Owner
              </th>

              <th className="p-4 text-left">
                Email
              </th>

              <th className="p-4 text-left">
                Phone
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Actions
              </th>
            </tr>

          </thead>

          <tbody>

            {vendors.map((vendor) => (
              <tr
                key={vendor._id}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-4">
                  {vendor.shopName}
                </td>

                <td className="p-4">
                  {vendor.ownerName}
                </td>

                <td className="p-4">
                  {vendor.email}
                </td>

                <td className="p-4">
                  {vendor.phone}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      vendor.isVerified
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {vendor.isVerified
                      ? "Verified"
                      : "Not Verified"}
                  </span>
                </td>

                <td className="p-4">

                  <div className="flex flex-wrap gap-2">

                    <button
                      onClick={() =>
                        navigate(
                          `/admin/vendors/${vendor._id}`
                        )
                      }
                      className="bg-blue-600 text-white px-3 py-2 rounded"
                    >
                      View
                    </button>

                    {!vendor.isVerified ? (
                      <button
                        onClick={() =>
                          handleVerify(
                            vendor._id
                          )
                        }
                        className="bg-green-600 text-white px-3 py-2 rounded"
                      >
                        Verify
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleUnverify(
                            vendor._id
                          )
                        }
                        className="bg-yellow-500 text-white px-3 py-2 rounded"
                      >
                        Unverify
                      </button>
                    )}

                    <button
                      onClick={() =>
                        handleDelete(
                          vendor._id
                        )
                      }
                      className="bg-red-600 text-white px-3 py-2 rounded"
                    >
                      Delete
                    </button>

                  </div>

                </td>
              </tr>
            ))}

          </tbody>

        </table>
      </div>
    </div>
  );
}