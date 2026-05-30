import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";
import api from "../services/api";

export default function AdminVariant() {

  // =========================
  // STATES
  // =========================
  const [variants, setVariants] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      size: "",
      price: "",
      offerPrice: "",
      stockQuantity: "",
    });

  // =========================
  // FETCH VARIANTS
  // =========================
  const fetchVariants =
    async () => {

      try {

        const res =
          await api.get(
            "/variants"
          );

        setVariants(
          res.data.variants || []
        );

      } catch (error) {

        console.log(
          "FETCH VARIANTS ERROR:",
          error
        );
      }
    };

  useEffect(() => {

    fetchVariants();

  }, []);

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {

    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  // =========================
  // CREATE VARIANT
  // =========================
  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    try {

      setLoading(true);

      const payload = {
        size:
          formData.size.trim(),

      
       

      };

      const res =
        await api.post(
          "/variants",
          payload
        );

      alert(
        res.data.message ||
          "Variant created successfully"
      );

      // RESET FORM
      setFormData({
        size: "",
        price: "",
        offerPrice: "",
        stockQuantity: "",
      });

      // REFRESH LIST
      fetchVariants();

    } catch (error) {

      console.log(
        "CREATE VARIANT ERROR:",
        error
      );

      alert(
        error.response?.data
          ?.message ||
          "Failed to create variant"
      );

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // DELETE VARIANT
  // =========================
  const deleteVariant =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this variant?"
        );

      if (!confirmDelete)
        return;

      try {

        await api.delete(
          `/variants/${id}`
        );

        alert(
          "Variant deleted successfully"
        );

        fetchVariants();

      } catch (error) {

        console.log(
          "DELETE VARIANT ERROR:",
          error
        );

        alert(
          error.response?.data
            ?.message ||
            "Failed to delete variant"
        );
      }
    };

  return (

    <div className="p-4 md:p-8">

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}
      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-800">
          Manage Variants
        </h1>

        <p className="text-gray-500 mt-2">
          Create and manage product variants
        </p>

      </div>

      {/* ========================= */}
      {/* FORM */}
      {/* ========================= */}
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-10">

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
        >

          {/* SIZE */}
          <div>

            <label className="block mb-2 font-medium">
              Size
            </label>

            <input
              type="text"
              name="size"
              placeholder="Ex: 1kg"
              value={formData.size}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg w-full outline-none focus:border-black"
              required
            />

          </div>

          

         

          <div>

            

            

          </div>

          {/* BUTTON */}
          <div className="flex items-end">

            <button
              type="submit"
              disabled={loading}
              className="bg-black hover:bg-gray-800 text-white w-full py-3 rounded-lg transition disabled:opacity-50"
            >

              {loading
                ? "Creating..."
                : "Add Variant"}

            </button>

          </div>

        </form>

      </div>

      {/* ========================= */}
      {/* VARIANTS LIST */}
      {/* ========================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

        {variants.length === 0 ? (

          <div className="col-span-full bg-white rounded-2xl shadow p-10 text-center">

            <p className="text-gray-500 text-lg">
              No variants found
            </p>

          </div>

        ) : (

          variants.map(
            (variant) => (

              <div
                key={variant._id}
                className="bg-white rounded-2xl shadow-md border p-5"
              >

                <div className="space-y-2">

                  <h2 className="text-xl font-bold text-gray-800">
                    {variant.size}
                  </h2>

                

                 

               
                </div>

                {/* DELETE BUTTON */}
                <button
                  onClick={() =>
                    deleteVariant(
                      variant._id
                    )
                  }
                  className="mt-5 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
                >
                  Delete Variant
                </button>

              </div>
            )
          )
        )}

      </div>

    </div>
  );
}