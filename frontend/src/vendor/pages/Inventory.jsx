import React, {
  useEffect,
  useState,
} from "react";

import {
  Menu,
  X,
} from "lucide-react";

import api from "../api/api";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Inventory = () => {
  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [
    stockDrafts,
    setStockDrafts,
  ] = useState({});

  const [
    savingProductId,
    setSavingProductId,
  ] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "vendorToken"
          );

        const { data } =
          await api.get(
            "/products/vendor/my-products",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        if (data.success) {
          setProducts(
            data.products
          );
          setStockDrafts(
            createStockDrafts(
              data.products || []
            )
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  const createStockDrafts = (
    productList
  ) => {
    return productList.reduce(
      (drafts, product) => {
        drafts[product._id] =
          product.variants?.length > 0
            ? product.variants.reduce(
                (
                  variantDrafts,
                  variant
                ) => {
                  variantDrafts[
                    variant._id
                  ] =
                    variant.stockQuantity ??
                    0;

                  return variantDrafts;
                },
                {}
              )
            : {
                productStock:
                  product.stockQuantity ||
                  0,
              };

        return drafts;
      },
      {}
    );
  };

  const handleStockChange = (
    productId,
    variantId,
    value
  ) => {
    setStockDrafts((prev) => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || {}),
        [variantId]:
          value === ""
            ? ""
            : Math.max(
                0,
                Number(value)
              ),
      },
    }));
  };

  const saveStock = async (
    product
  ) => {
    try {
      const token =
        localStorage.getItem(
          "vendorToken"
        );

      setSavingProductId(
        product._id
      );

      const productDraft =
        stockDrafts[product._id] ||
        {};

      const payload =
        product.variants?.length > 0
          ? {
              variants:
                product.variants.map(
                  (variant) => ({
                    _id: variant._id,
                    stockQuantity:
                      Number(
                        productDraft[
                          variant._id
                        ] ?? 0
                      ),
                  })
                ),
            }
          : {
              stockQuantity:
                Number(
                  productDraft.productStock ??
                    0
                ),
            };

      const { data } =
        await api.patch(
          `/products/${product._id}/inventory`,
          payload,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      if (data.success) {
        setProducts((prev) =>
          prev.map((item) =>
            item._id ===
            data.product._id
              ? data.product
              : item
          )
        );

        setStockDrafts((prev) => ({
          ...prev,
          ...createStockDrafts([
            data.product,
          ]),
        }));

        alert(
          "Inventory updated"
        );
      }
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data
          ?.message ||
          "Failed to update inventory"
      );
    } finally {
      setSavingProductId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-hidden">

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
          fixed lg:static z-50
          h-full
          transition-transform duration-300
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <Sidebar />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* NAVBAR */}
        <div className="sticky top-0 z-30 bg-white shadow-sm">
          <div className="flex items-center">

            <button
              onClick={() =>
                setSidebarOpen(
                  !sidebarOpen
                )
              }
              className="lg:hidden p-4"
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
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6">

          {/* PAGE HEADER */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">
              Inventory
            </h1>

            <p className="text-gray-500 mt-1 text-sm md:text-base">
              Monitor product stock and variant availability
            </p>
          </div>

          {/* LOADING */}
          {loading ? (
            <div className="flex justify-center items-center h-[50vh]">
              <div className="text-xl md:text-2xl font-semibold animate-pulse">
                Loading Inventory...
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-10 text-center">

              <h2 className="text-2xl font-bold mb-3">
                No Products Found
              </h2>

              <p className="text-gray-500">
                Inventory is empty.
              </p>

            </div>
          ) : (
            <div className="space-y-6">

              {products.map(
                (product) => {

                  const totalVariantStock =
  product?.variants?.reduce(
    (total, variant) =>
      total +
      Number(
        variant.stockQuantity ||
        variant.stock ||
        variant.quantity ||
        0
      ),
    0
  ) || product.stockQuantity || 0;

                  
                  
                  
                    return (
                    <div
                      key={
                        product._id
                      }
                      className="bg-white rounded-2xl shadow-md p-4 md:p-6"
                    >

                      {/* PRODUCT HEADER */}
                      <div className="flex flex-col lg:flex-row gap-5">

                        <img
                          src={
                            product
                              ?.image?.[0]
                          }
                          alt={
                            product.name
                          }
                          className="w-full lg:w-40 h-48 lg:h-40 object-cover rounded-xl border"
                        />

                        <div className="flex-1">

                          <h2 className="text-xl md:text-2xl font-bold">
                            {
                              product.name
                            }
                          </h2>

                          <p className="text-gray-500 mt-2">
                            Category:{" "}
                            {
                              product
                                ?.category
                                ?.text
                            }
                          </p>

                          <div className="mt-4 flex flex-wrap gap-3">

                            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                              Total Stock:{" "}
                              {
                                totalVariantStock
                              }
                            </span>

                            <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                              Variants:{" "}
                              {
                                product
                                  ?.variants
                                  ?.length
                              }
                            </span>

                            {product.inStock ? (
                              <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                                In Stock
                              </span>
                            ) : (
                              <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium">
                                Out Of Stock
                              </span>
                            )}

                          </div>

                        </div>

                      </div>

                      {/* VARIANTS */}
                      <div className="mt-6">

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                          <h3 className="font-bold text-lg">
                            Variant Inventory
                          </h3>

                          <button
                            type="button"
                            onClick={() =>
                              saveStock(
                                product
                              )
                            }
                            disabled={
                              savingProductId ===
                              product._id
                            }
                            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-semibold w-full sm:w-auto"
                          >
                            {savingProductId ===
                            product._id
                              ? "Saving..."
                              : "Save Stock"}
                          </button>
                        </div>

               {product?.variants?.length > 0 ? (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

    {product.variants.map((variant) => {

      const stock =
        variant.stockQuantity ??
        variant.stock ??
        variant.quantity ??
        0;

      return (
        <div
          key={variant._id}
          className="border rounded-xl p-4 bg-gray-50 hover:shadow-md transition"
        >
          <div className="flex justify-between items-center mb-3">

            <h4 className="font-bold text-lg">
              {variant.size}
            </h4>

            {stock > 0 ? (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                Available
              </span>
            ) : (
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">
                Out Of Stock
              </span>
            )}

          </div>

          <div className="space-y-2">

            <p>
              <span className="font-semibold">
                Price:
              </span>{" "}
              ₹{variant.price}
            </p>

            <p>
              <span className="font-semibold">
                Offer Price:
              </span>{" "}
              ₹{variant.offerPrice}
            </p>

            <p>
              <span className="font-semibold">
                Available Stock:
              </span>{" "}
            </p>

            <input
              type="number"
              min="0"
              value={
                stockDrafts[
                  product._id
                ]?.[variant._id] ??
                stock
              }
              onChange={(e) =>
                handleStockChange(
                  product._id,
                  variant._id,
                  e.target.value
                )
              }
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
            />

          </div>

        </div>
      );
    })}

  </div>
) : (
  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
    <p className="text-yellow-700">
      No variants found for this product.
    </p>

    <p className="mt-2 font-semibold">
      Product Stock
    </p>

    <input
      type="number"
      min="0"
      value={
        stockDrafts[
          product._id
        ]?.productStock ??
        product.stockQuantity ??
        0
      }
      onChange={(e) =>
        handleStockChange(
          product._id,
          "productStock",
          e.target.value
        )
      }
      className="mt-3 w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
    />
  </div>
)}

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Inventory;
