/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react"
import AdminLayout from "../layout/AdminLayout"
import { Link, useNavigate } from "react-router-dom"
import api from "../services/api"

export default function Product() {
  const [products, setProducts] = useState([])
  const navigate = useNavigate()

  // GET PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products")
      setProducts(Array.isArray(res.data?.products) ? res.data.products : [])
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // DELETE PRODUCT
  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`)
      fetchProducts() // refresh list
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>

        <Link
          to="/admin/products/create"
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Add Product
        </Link>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p._id} className="border-t">
                  {/* IMAGE */}
                  <td className="p-3">
                    <img
                      src={Array.isArray(p.image) ? p.image[0] : p.image}
                      alt={p.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>

                  {/* NAME */}
                  <td className="p-3">{p.name}</td>

                  {/* PRICE */}
                  <td className="p-3">₹{p.price}</td>

                  {/* STOCK */}
                  <td className="p-3">{p.stock}</td>

                  {/* ACTIONS */}
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => navigate(`/admin/products/edit/${p._id}`)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteProduct(p._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
