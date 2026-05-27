import {
  createContext,
  useEffect,
  useState,
} from "react";

import api from "../api/Axios";

// =========================
// CREATE CONTEXT
// =========================
export const ShopContext =
  createContext();

// =========================
// PROVIDER
// =========================
const ShopContextProvider = ({
  children,
}) => {

  // =========================
  // STATES
  // =========================
  const [products, setProducts] =
    useState([]);
const [categories, setCategories] =
  useState([]);
  const [cartItems, setCartItems] =
    useState([]);

  const [wishlistItems, setWishlistItems] =
    useState([]);

  const [
    loadingProducts,
    setLoadingProducts,
  ] = useState(true);

  const [user, setUser] =
    useState(
      JSON.parse(
        localStorage.getItem(
          "user"
        )
      ) || null
    );

  // =========================
  // FETCH PRODUCTS
  // =========================
  const fetchProducts =
    async () => {
      try {
        setLoadingProducts(
          true
        );

        const { data } =
          await api.get(
            "/products"
          );

        console.log(
          "PRODUCTS:",
          data.products
        );

        setProducts(
          data.products || []
        );

      } catch (error) {

        console.log(
          "FETCH PRODUCTS ERROR:",
          error
        );

      } finally {

        setLoadingProducts(
          false
        );
      }
    };

    // =========================
// FETCH CATEGORIES
// =========================
const fetchCategories =
  async () => {
    try {

      const { data } =
        await api.get(
          "/categories"
        );

      if (data.success) {

        setCategories(
          data.categories || []
        );
      }

    } catch (error) {

      console.log(
        "FETCH CATEGORY ERROR:",
        error
      );
    }
  };

  // =========================
  // FETCH CART
  // =========================
  const fetchCart =
    async () => {

      try {

        if (!user?._id) {
          setCartItems([]);
          return;
        }

        const { data } =
          await api.get(
            `/cart/${user._id}`
          );

        console.log(
          "CART DATA:",
          data
        );

        setCartItems(
          data?.cart?.items || []
        );

      } catch (error) {

        console.log(
          "FETCH CART ERROR:",
          error
        );

        setCartItems([]);
      }
    };

  // =========================
  // FETCH WISHLIST
  // =========================
  const fetchWishlist =
    async () => {

      try {

        if (!user?._id) {

          setWishlistItems(
            []
          );

          return;
        }

        const { data } =
          await api.get(
            `/wishlist/${user._id}`
          );

        console.log(
          "WISHLIST DATA:",
          data
        );

        setWishlistItems(
          Array.isArray(
            data.wishlist
          )
            ? data.wishlist
            : []
        );

      } catch (error) {

        console.log(
          "FETCH WISHLIST ERROR:",
          error
        );

        setWishlistItems(
          []
        );
      }
    };

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {

  fetchProducts();

  fetchCategories();

}, []);

  // =========================
  // LOAD USER DATA
  // =========================
  useEffect(() => {

    const loadData =
      async () => {

        if (user?._id) {

          await fetchCart();

          await fetchWishlist();

        } else {

          setCartItems([]);

          setWishlistItems([]);
        }
      };

    loadData();

  }, [user]);

  // =========================
  // ADD TO CART
  // =========================
  const addToCart =
    async (product) => {

      try {

        if (!user) {

          alert(
            "Please login first"
          );

          return;
        }

        const cartProduct = {

          productId:
            product._id,

          name:
            product.name,

          image:
            product.image?.[0] ||
            "",

          category:
            product.category,

          price:
            product.offerPrice,

          quantity: 1,
        };

        const { data } =
          await api.post(
            "/cart/add",
            {
              userId:
                user._id,

              product:
                cartProduct,
            }
          );

        setCartItems(
          data.cart.items
        );

        alert(
          "Added To Cart"
        );

      } catch (error) {

        console.log(
          "ADD TO CART ERROR:",
          error
        );
      }
    };

  // =========================
  // INCREASE QUANTITY
  // =========================
  const increaseQuantity =
    async (productId) => {

      try {

        const item =
          cartItems.find(
            (item) =>
              item.productId ===
              productId
          );

        if (!item) return;

        const { data } =
          await api.put(
            "/cart/update",
            {
              userId:
                user._id,

              productId,

              quantity:
                item.quantity +
                1,
            }
          );

        setCartItems(
          data.cart.items
        );

      } catch (error) {

        console.log(
          "INCREASE ERROR:",
          error
        );
      }
    };

  // =========================
  // DECREASE QUANTITY
  // =========================
  const decreaseQuantity =
    async (productId) => {

      try {

        const item =
          cartItems.find(
            (item) =>
              item.productId ===
              productId
          );

        if (!item) return;

        if (
          item.quantity <= 1
        ) {

          await removeFromCart(
            productId
          );

          return;
        }

        const { data } =
          await api.put(
            "/cart/update",
            {
              userId:
                user._id,

              productId,

              quantity:
                item.quantity -
                1,
            }
          );

        setCartItems(
          data.cart.items
        );

      } catch (error) {

        console.log(
          "DECREASE ERROR:",
          error
        );
      }
    };

  // =========================
  // REMOVE FROM CART
  // =========================
  const removeFromCart =
    async (productId) => {

      try {

        const { data } =
          await api.delete(
            "/cart/remove",
            {
              data: {
                userId:
                  user._id,

                productId,
              },
            }
          );

        setCartItems(
          data.cart.items
        );

      } catch (error) {

        console.log(
          "REMOVE CART ERROR:",
          error
        );
      }
    };

  // =========================
  // CLEAR CART
  // =========================
  const clearCart =
    async () => {

      try {

        setCartItems([]);

        if (!user?._id)
          return;

        await api.delete(
          "/cart/clear",
          {
            data: {
              userId:
                user._id,
            },
          }
        );

      } catch (error) {

        console.log(
          "CLEAR CART ERROR:",
          error
        );
      }
    };

  // =========================
  // ADD TO WISHLIST
  // =========================
  const addToWishlist =
    async (productId) => {

      try {

        if (!user) {

          alert(
            "Please login first"
          );

          return;
        }

        const { data } =
          await api.post(
            "/wishlist/add",
            {
              userId:
                user._id,

              productId,
            }
          );

        await fetchWishlist();

        return data;

      } catch (error) {

        console.log(
          "ADD WISHLIST ERROR:",
          error
        );
      }
    };

  // =========================
  // REMOVE FROM WISHLIST
  // =========================
  const removeFromWishlist =
    async (productId) => {

      try {

        await api.delete(
          "/wishlist/remove",
          {
            data: {
              userId:
                user._id,

              productId,
            },
          }
        );

        await fetchWishlist();

      } catch (error) {

        console.log(
          "REMOVE WISHLIST ERROR:",
          error
        );
      }
    };

  // =========================
  // LOGIN USER
  // =========================
  const loginUser =
    (userData) => {

      setUser(userData);

      localStorage.setItem(
        "user",
        JSON.stringify(
          userData
        )
      );
    };

  // =========================
  // LOGOUT USER
  // =========================
  const logoutUser =
    () => {

      setUser(null);

      setCartItems([]);

      setWishlistItems([]);

      localStorage.removeItem(
        "user"
      );

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "cart"
      );
    };

  // =========================
  // PROVIDER VALUE
  // =========================
  const value = {
  products,
  categories,
  loadingProducts,

  cartItems,
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,

  wishlistItems,
  addToWishlist,
  removeFromWishlist,

  user,
  loginUser,
  logoutUser,

  fetchCart,
  fetchWishlist,
};

  return (

    <ShopContext.Provider
      value={value}
    >

      {children}

    </ShopContext.Provider>
  );
};

export default
  ShopContextProvider;