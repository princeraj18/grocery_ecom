import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Vendors() {
  const navigate = useNavigate();

  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");

  const fetchVendors = async () => {
    try {
      const { data } = await api.get(`/admin/vendors?search=${encodeURIComponent(search)}`);
      setVendors(data.vendors || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [search]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this vendor?");
    if (!confirmDelete) return;

    try {
      const { data } = await api.delete(`/admin/vendors/${id}`);
      alert(data.message || "Vendor deleted");
      fetchVendors();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Delete failed");
    }
  };
const handleVerify = async (id) => {

  try {

    const { data } =
      await api.put(
        `/vendors/verify/${id}`
      );

    alert(
      data.message ||
      "Vendor verified"
    );

    fetchVendors();

  } catch (error) {

    console.log(error);

    alert(
      error.response?.data
        ?.message ||
        "Verification failed"
    );
  }
};

const handleUnverify = async (id) => {

  try {

    const { data } =
      await api.put(
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
      error.response?.data
        ?.message ||
        "Unverify failed"
    );
  }
};
  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Vendors</h1>

        <input
          type="text"
          placeholder="Search vendors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-3 rounded-lg w-72"
        />
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full">
          <thead className="bg-black text-white">
            <tr>
              <th className="p-4 text-left">Shop Name</th>
              <th className="p-4 text-left">Owner</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor._id} className="border-b">
                <td className="p-4">{vendor.shopName}</td>
                <td className="p-4">{vendor.ownerName}</td>
                <td className="p-4">{vendor.email}</td>
                <td className="p-4">{vendor.phone}</td>

               <td className="p-4 flex gap-3">

  {/* VIEW */}
  <button
    onClick={() =>
      navigate(
        `/admin/vendors/${vendor._id}`
      )
    }
    className="bg-blue-600 text-white px-4 py-2 rounded"
  >
    View
  </button>

  {/* VERIFY */}
  {!vendor.isVerified && (
    <button
      onClick={() =>
        handleVerify(vendor._id)
      }
      className="bg-green-600 text-white px-4 py-2 rounded"
    >
      Verify
    </button>
  )}

  {/* UNVERIFY */}
  {vendor.isVerified && (
    <button
      onClick={() =>
        handleUnverify(vendor._id)
      }
      className="bg-yellow-500 text-white px-4 py-2 rounded"
    >
      Unverify
    </button>
  )}

  {/* DELETE */}
  <button
    onClick={() =>
      handleDelete(vendor._id)
    }
    className="bg-red-600 text-white px-4 py-2 rounded"
  >
    Delete
  </button>

</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
