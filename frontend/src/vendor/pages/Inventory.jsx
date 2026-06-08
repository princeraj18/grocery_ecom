import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import api from "../api/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stockDrafts, setStockDrafts] = useState({});
  const [savingProductId, setSavingProductId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("vendorToken");
      const { data } = await api.get("/products/vendor/my-products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setProducts(data.products);
        setStockDrafts(createStockDrafts(data.products || []));
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const createStockDrafts = (productList) => {
    return productList.reduce((drafts, product) => {
      drafts[product._id] =
        product.variants?.length > 0
          ? product.variants.reduce((variantDrafts, variant) => {
              variantDrafts[variant._id] = variant.stockQuantity ?? 0;
              return variantDrafts;
            }, {})
          : {
              productStock: product.stockQuantity || 0,
            };
      return drafts;
    }, {});
  };

  const handleStockChange = (productId, variantId, value) => {
    setStockDrafts((prev) => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || {}),
        [variantId]: value === "" ? "" : Math.max(0, Number(value)),
      },
    }));
  };

  const saveStock = async (product) => {
    try {
      const token = localStorage.getItem("vendorToken");
      setSavingProductId(product._id);

      const productDraft = stockDrafts[product._id] || {};

      const payload =
        product.variants?.length > 0
          ? {
              variants: product.variants.map((variant) => ({
                _id: variant._id,
                stockQuantity: Number(productDraft[variant._id] === "" ? 0 : productDraft[variant._id]),
              })),
            }
          : {
              stockQuantity: Number(productDraft.productStock === "" ? 0 : productDraft.productStock),
            };

      const { data } = await api.patch(
        `/products/${product._id}/inventory`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setProducts((prev) =>
          prev.map((item) => (item._id === data.product._id ? data.product : item))
        );

        setStockDrafts((prev) => ({
          ...prev,
          ...createStockDrafts([data.product]),
        }));

        alert("Inventory updated successfully!");
      }
    } catch (error) {
      console.error("Error saving inventory:", error);
      alert(
        error.response?.data?.message || "Failed to update inventory"
      );
    } finally {
      setSavingProductId(null);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100 overflow-hidden relative">
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <div
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-white h-full shadow-lg lg:shadow-none transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <Sidebar />
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* NAVBAR */}
        <div className="sticky top-0 z-30 bg-white shadow-sm flex items-center h-16 px-2 lg:px-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle Menu"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex-1 min-w-0">
            <Navbar />
          </div>
        </div>

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {/* PAGE HEADER */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Inventory</h1>
            <p className="text-gray-500 mt-1 text-sm md:text-base">
              Monitor product stock and variant availability
            </p>
          </div>

          {/* LOADING STATE */}
          {loading ? (
            <div className="flex justify-center items-center h-[50vh]">
              <div className="text-xl md:text-2xl font-semibold text-gray-600 animate-pulse">
                Loading Inventory...
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-10 text-center">
              <h2 className="text-2xl font-bold mb-3 text-gray-800">No Products Found</h2>
              <p className="text-gray-500">Inventory is empty.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {products.map((product) => {
                const totalVariantStock =
                  product?.variants?.reduce(
                    (total, variant) =>
                      total + Number(variant.stockQuantity ?? variant.stock ?? variant.quantity ?? 0),
                    0
                  ) || product.stockQuantity || 0;

                return (
                  <div
                    key={product._id}
                    className="bg-white rounded-2xl shadow-md p-4 md:p-6 border border-gray-100"
                  >
                    {/* PRODUCT HEADER */}
                    <div className="flex flex-col lg:flex-row gap-5">
                      <img
                        src={product?.image?.[0] || "https://placehold.co/160x160?text=No+Image"}
                        alt={product.name}
                        className="w-full lg:w-40 h-48 lg:h-40 object-cover rounded-xl border border-gray-200"
                      />

                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
                          {product.name}
                        </h2>
                        <p className="text-gray-500 mt-1 text-sm">
                          Category: {product?.category?.text || "Uncategorized"}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2.5">
                          <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border border-blue-100">
                            Total Stock: {totalVariantStock}
                          </span>
                          <span className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border border-purple-100">
                            Variants: {product?.variants?.length || 0}
                          </span>
                          {product.inStock ? (
                            <span className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border border-green-100">
                              In Stock
                            </span>
                          ) : (
                            <span className="bg-red-50 text-red-700 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border border-red-100">
                              Out Of Stock
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* VARIANTS AND INPUTS SECTION */}
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                        <h3 className="font-bold text-gray-800 text-lg">Variant Inventory</h3>
                        <button
                          type="button"
                          onClick={() => saveStock(product)}
                          disabled={savingProductId === product._id}
                          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-5 py-2.5 rounded-xl text-sm font-semibold w-full sm:w-auto shadow-sm transition-all active:scale-[0.98]"
                        >
                          {savingProductId === product._id ? "Saving..." : "Save Stock"}
                        </button>
                      </div>

                      {product?.variants?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                          {product.variants.map((variant) => {
                            const stock = variant.stockQuantity ?? variant.stock ?? variant.quantity ?? 0;
                            const currentDraftValue = stockDrafts[product._id]?.[variant._id];

                            return (
                              <div
                                key={variant._id}
                                className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 hover:shadow-sm transition"
                              >
                                <div className="flex justify-between items-center mb-3">
                                  <h4 className="font-bold text-gray-800 text-lg">{variant.size}</h4>
                                  {stock > 0 ? (
                                    <span className="bg-green-100 text-green-800 px-2.5 py-1 rounded-full text-xs font-medium">
                                      Available
                                    </span>
                                  ) : (
                                    <span className="bg-red-100 text-red-800 px-2.5 py-1 rounded-full text-xs font-medium">
                                      Out Of Stock
                                    </span>
                                  )}
                                </div>

                                <div className="space-y-2 text-sm text-gray-600">
                                  <p>
                                    <span className="font-medium text-gray-500">Price:</span> ₹{variant.price}
                                  </p>
                                  <p>
                                    <span className="font-medium text-gray-500">Offer Price:</span> ₹{variant.offerPrice}
                                  </p>
                                  <p className="font-semibold text-xs text-gray-700 uppercase tracking-wider pt-1">
                                    Available Stock:
                                  </p>
                                  <input
                                    type="number"
                                    min="0"
                                    value={currentDraftValue ?? stock}
                                    onChange={(e) =>
                                      handleStockChange(product._id, variant._id, e.target.value)
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white text-gray-900 transition"
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                          <p className="text-yellow-800 text-sm">
                            No variants found for this product.
                          </p>
                          <p className="mt-3 font-semibold text-sm text-gray-700">
                            Product Stock
                          </p>
                          <input
                            type="number"
                            min="0"
                            value={
                              stockDrafts[product._id]?.productStock ??
                              product.stockQuantity ??
                              0
                            }
                            onChange={(e) =>
                              handleStockChange(product._id, "productStock", e.target.value)
                            }
                            className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white text-gray-900 transition"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;