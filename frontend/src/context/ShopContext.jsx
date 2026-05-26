import {
  createContext,
  useEffect,
  useState,
} from "react";

import api from "../api/Axios";

export const ShopContext =
  createContext();

const ShopContextProvider = ({
  children,
}) => {

  const [products, setProducts] =
    useState([]);

  const [cartItems, setCartItems] =
    useState([]);
const [wishlistItems, setWishlistItems] =
  useState([]);
  const [loadingProducts, setLoadingProducts] =
    useState(true);

  const [user, setUser] =
    useState(
      JSON.parse(
        localStorage.getItem("user")
      ) || null
    );

  // =========================
  // FETCH PRODUCTS
  // =========================
  const fetchProducts = async () => {

    try {

      setLoadingProducts(true);

      const { data } =
        await api.get("/products");

      console.log(
        "PRODUCTS:",
        data.products
      );

      setProducts(data.products);

    } catch (error) {

      console.log(
        "FETCH PRODUCTS ERROR:",
        error
      );

    } finally {

      setLoadingProducts(false);
    }
  };

  useEffect(() => {

    fetchProducts();

  }, []);

  // =========================
  // FETCH CART
  // =========================
  const fetchCart = async () => {

    try {

      if (!user?._id) return;

      const { data } =
        await api.get(
          `/cart/${user._id}`
        );

      setCartItems(
        data.cart.items || []
      );

    } catch (error) {

      console.log(
        "FETCH CART ERROR:",
        error
      );
    }
  };

// FETCH WISHLIST
// =========================
const fetchWishlist = async () => {

  try {

    if (!user?._id) {

      setWishlistItems([]);

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

    // IMPORTANT FIX
    setWishlistItems(
      Array.isArray(data.wishlist)
        ? data.wishlist
        : []
    );

  } catch (error) {

    console.log(
      "FETCH WISHLIST ERROR:",
      error
    );

    setWishlistItems([]);
  }
};
useEffect(() => {

  const loadData = async () => {

    if (user?._id) {

      await fetchCart();

      await fetchWishlist();
    }
  };

  loadData();

}, [user]);
  // =========================
  // ADD TO CART
  // =========================
  const addToCart = async (
    product
  ) => {

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
          product.image?.[0] || "",

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
            userId: user._id,
            product: cartProduct,
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
                item.quantity + 1,
            }
          );

        setCartItems(
          data.cart.items
        );

      } catch (error) {

        console.log(error);
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

        if (item.quantity <= 1) {

          removeFromCart(
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
                item.quantity - 1,
            }
          );

        setCartItems(
          data.cart.items
        );

      } catch (error) {

        console.log(error);
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

        console.log(error);
      }
    };

    // =========================
// ADD TO WISHLIST
// =========================
const addToWishlist =
  async (productId) => {

    try {

      const { data } =
        await api.post(
          "/wishlist/add",
          {
            userId: user._id,
            productId,
          }
        );

      fetchWishlist();

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
            userId: user._id,
            productId,
          },
        }
      );

      fetchWishlist();

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
  const loginUser = (
    userData
  ) => {

    setUser(userData);

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );
  };

  // =========================
  // LOGOUT USER
  // =========================
  const logoutUser = () => {

    setUser(null);

    setCartItems([]);

    localStorage.removeItem(
      "user"
    );

    localStorage.removeItem(
      "token"
    );
  };

  return (

    <ShopContext.Provider
      value={{

        products,

        loadingProducts,

        cartItems,

        addToCart,

        increaseQuantity,

        decreaseQuantity,

        removeFromCart,

        user,

        loginUser,

        logoutUser,
        wishlistItems,
        addToWishlist,
        removeFromWishlist,

      }}
    >

      {children}

    </ShopContext.Provider>
  );
};

export default
  ShopContextProvider;