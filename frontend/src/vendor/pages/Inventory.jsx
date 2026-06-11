import React, { useEffect, useState } from "react";
import { Menu, X, Package, AlertTriangle } from "lucide-react";
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
              variantDrafts[variant._id] = variant.stockQuantity ?? variant.stock ?? variant.quantity ?? 0;
              return variantDrafts;
            }, {})
          : {
              productStock: product.stockQuantity ?? product.stock ?? product.quantity ?? 0,
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
                stockQuantity: Number(productDraft[variant._id] === "" ? 0 : productDraft[variant._id] ?? 0),
              })),
            }
          : {
              stockQuantity: Number(productDraft.productStock === "" ? 0 : productDraft.productStock ?? 0),
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
    <div className="flex h-screen w-screen bg-gray-100 dark:bg-slate-950 overflow-hidden relative">
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 h-full shadow-lg lg:shadow-none transition-transform duration-300 ease-in-out ${ sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0" }`}
      >
        <Sidebar />
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* NAVBAR */}
        <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 shadow-sm flex items-center h-16 px-2 lg:px-4 border-b border-gray-200 dark:border-slate-800">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Toggle Menu"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex-1 min-w-0">
            <Navbar />
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {/* PAGE HEADER */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Inventory</h1>
            <p className="text-gray-500 dark:text-slate-400 mt-1 text-sm md:text-base">
              Monitor product stock and variant availability
            </p>
          </div>

          {/* LOADING STATE */}
          {loading ? (
            <div className="flex flex-col gap-3 justify-center items-center h-[50vh]">
              <div className="w-10 h-10 border-4 border-gray-900 dark:border-white border-t-transparent rounded-full animate-spin" />
              <div className="text-lg font-medium text-gray-600 dark:text-slate-400 animate-pulse">
                Loading Inventory...
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow p-12 text-center max-w-md mx-auto mt-12 border border-gray-200 dark:border-slate-800">
              <div className="w-12 h-12 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 dark:text-slate-500">
                <Package size={24} />
              </div>
              <h2 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">No Products Found</h2>
              <p className="text-gray-500 dark:text-slate-400 text-sm">Your inventory is currently empty.</p>
            </div>
          ) : (
            <div className="space-y-6 max-w-6xl">
              {products.map((product) => {
                const totalVariantStock =
                  product?.variants?.reduce(
                    (total, variant) =>
                      total + Number(variant.stockQuantity ?? variant.stock ?? variant.quantity ?? 0),
                    0
                  ) || product.stockQuantity || product.stock || 0;

                return (
                  <div
                    key={product._id}
                    className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-4 md:p-6 border border-gray-200 dark:border-slate-800"
                  >
                    {/* PRODUCT HEADER */}
                    <div className="flex flex-col lg:flex-row gap-5">
                      <img
                        src={product?.image?.[0] || "https://placehold.co/160x160?text=No+Image"}
                        alt={product.name}
                        className="w-full lg:w-40 h-48 lg:h-40 object-cover rounded-xl border border-gray-200 dark:border-slate-800 flex-shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate">
                          {product.name}
                        </h2>
                        <p className="text-gray-500 dark:text-slate-400 mt-1 text-sm">
                          Category: {product?.category?.text || "Uncategorized"}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2.5">
                          <span className="bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border border-blue-100 dark:border-blue-900/50">
                            Total Stock: {totalVariantStock}
                          </span>
                          <span className="bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border border-purple-100 dark:border-purple-900/50">
                            Variants: {product?.variants?.length || 0}
                          </span>
                          {product.inStock ? (
                            <span className="bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border border-green-100 dark:border-green-900/50">
                              In Stock
                            </span>
                          ) : (
                            <span className="bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border border-red-100 dark:border-red-900/50">
                              Out Of Stock
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* VARIANTS AND INPUTS SECTION */}
                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-800">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">Variant Inventory</h3>
                        <button
                          type="button"
                          onClick={() => saveStock(product)}
                          disabled={savingProductId === product._id}
                          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-200 dark:disabled:bg-slate-800 dark:disabled:text-slate-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold w-full sm:w-auto shadow-sm transition-all active:scale-[0.98]"
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
                                className="border border-gray-200 dark:border-slate-800 rounded-xl p-4 bg-gray-50/50 dark:bg-slate-800/20 hover:shadow-sm transition"
                              >
                                <div className="flex justify-between items-center mb-3">
                                  <h4 className="font-bold text-gray-900 dark:text-white text-lg">{variant.size}</h4>
                                  {stock > 0 ? (
                                    <span className="bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400 px-2.5 py-1 rounded-full text-xs font-medium">
                                      Available
                                    </span>
                                  ) : (
                                    <span className="bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400 px-2.5 py-1 rounded-full text-xs font-medium">
                                      Out Of Stock
                                    </span>
                                  )}
                                </div>

                                <div className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
                                  <p>
                                    <span className="font-medium text-gray-500 dark:text-slate-500">Price:</span> ₹{variant.price}
                                  </p>
                                  <p>
                                    <span className="font-medium text-gray-500 dark:text-slate-500">Offer Price:</span> ₹{variant.offerPrice}
                                  </p>
                                  <label className="block font-semibold text-xs text-gray-700 dark:text-slate-300 uppercase tracking-wider pt-1">
                                    Available Stock:
                                    <input
                                      type="number"
                                      min="0"
                                      value={currentDraftValue !== undefined ? currentDraftValue : stock}
                                      onChange={(e) =>
                                        handleStockChange(product._id, variant._id, e.target.value)
                                      }
                                      className="mt-1.5 w-full border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white transition normal-case tracking-normal font-normal text-sm"
                                    />
                                  </label>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4">
                          <p className="text-amber-800 dark:text-amber-400 text-sm flex items-center gap-2 font-medium">
                            <AlertTriangle size={16} /> No distinct variants configured for this stock profile.
                          </p>
                          <label className="block mt-4 font-semibold text-xs text-gray-700 dark:text-slate-300 uppercase tracking-wider">
                            Product Stock
                            <input
                              type="number"
                              min="0"
                              value={
                                stockDrafts[product._id]?.productStock !== undefined
                                  ? stockDrafts[product._id].productStock
                                  : (product.stockQuantity ?? product.stock ?? 0)
                              }
                              onChange={(e) =>
                                handleStockChange(product._id, "productStock", e.target.value)
                              }
                              className="mt-2 w-full border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white transition font-normal normal-case tracking-normal text-sm"
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Inventory;