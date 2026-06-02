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
// NORMALIZE WISHLIST
// =========================
const normalizeWishlist = (
  wishlist
) => {

  if (
    Array.isArray(
      wishlist?.items
    )
  ) {
    return wishlist.items;
  }

  if (
    Array.isArray(
      wishlist
    )
  ) {
    return wishlist;
  }

  if (
    wishlist &&
    wishlist.product
  ) {
    return [wishlist];
  }

  return [];
};

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
    useState(
      JSON.parse(
        localStorage.getItem(
          "guestCart"
        )
      ) || []
    );

  const [
    wishlistItems,
    setWishlistItems,
  ] = useState(
    JSON.parse(
      localStorage.getItem(
        "guestWishlist"
      )
    ) || []
  );

  const [
    notifications,
    setNotifications,
  ] = useState([]);

  const [
    unreadNotificationCount,
    setUnreadNotificationCount,
  ] = useState(0);

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
  // SAVE GUEST DATA
  // =========================
  useEffect(() => {

    if (!user) {

      localStorage.setItem(
        "guestCart",
        JSON.stringify(
          cartItems
        )
      );

      localStorage.setItem(
        "guestWishlist",
        JSON.stringify(
          wishlistItems
        )
      );
    }

  }, [
    cartItems,
    wishlistItems,
    user,
  ]);

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

        setCategories(
          data.categories || []
        );

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

        if (!user?._id)
          return;

        const { data } =
          await api.get(
            `/cart/${user._id}`
          );

        setCartItems(
          data?.cart?.items || []
        );

      } catch (error) {

        console.log(
          "FETCH CART ERROR:",
          error
        );
      }
    };

  // =========================
  // FETCH WISHLIST
  // =========================
  const fetchWishlist =
    async () => {

      try {

        if (!user?._id)
          return;

        const { data } =
          await api.get(
            `/wishlist/${user._id}`
          );

        setWishlistItems(
          normalizeWishlist(
            data.wishlist
          )
        );

      } catch (error) {

        console.log(
          "FETCH WISHLIST ERROR:",
          error
        );
      }
    };

  // =========================
  // FETCH NOTIFICATIONS
  // =========================
  const fetchNotifications =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        if (!token) {

          setNotifications([]);

          setUnreadNotificationCount(
            0
          );

          return;
        }

        const { data } =
          await api.get(
            "/notifications/my-notifications",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const allNotifications =
          data.notifications || [];

        setNotifications(
          allNotifications
        );

        setUnreadNotificationCount(
          allNotifications.filter(
            (item) =>
              !item.isRead
          ).length
        );

      } catch (error) {

        console.log(
          "FETCH NOTIFICATION ERROR:",
          error
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

    if (user?._id) {

      fetchCart();

      fetchWishlist();

      fetchNotifications();
    }

  }, [user]);

  // =========================
  // ADD TO CART
  // =========================
  const addToCart =
    async (product) => {

      const selectedVariant =
        product.selectedVariant ||
        product.variants?.[0];

      if (!selectedVariant)
        return;

      const cartProduct = {

        productId:
          product._id,

        variantSize:
          selectedVariant.size ||
          "Default",

        variantId:
          selectedVariant._id,

        name:
          product.name,

        image:
          Array.isArray(
            product.image
          )
            ? product.image[0]
            : product.image,

        category:
          product.category,

        price:
          selectedVariant.offerPrice,

        originalPrice:
          selectedVariant.price,

        quantity: 1,
      };

      // GUEST
      if (!user) {

        const existing =
          cartItems.find(
            (item) =>
              item.productId ===
                cartProduct.productId &&
              item.variantSize ===
                cartProduct.variantSize
          );

        if (existing) {

          setCartItems(
            cartItems.map(
              (item) =>
                item.productId ===
                  cartProduct.productId &&
                item.variantSize ===
                  cartProduct.variantSize
                  ? {
                      ...item,
                      quantity:
                        item.quantity + 1,
                    }
                  : item
            )
          );

        } else {

          setCartItems([
            ...cartItems,
            cartProduct,
          ]);
        }

        return;
      }

      // USER
      try {

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
    async (
      productId,
      variantSize
    ) => {

      // GUEST
      if (!user) {

        setCartItems(
          cartItems.map(
            (item) =>
              item.productId ===
                productId &&
              item.variantSize ===
                variantSize
                ? {
                    ...item,
                    quantity:
                      item.quantity + 1,
                  }
                : item
          )
        );

        return;
      }

      // USER
      try {

        const item =
          cartItems.find(
            (item) =>
              item.productId ===
                productId &&
              item.variantSize ===
                variantSize
          );

        if (!item)
          return;

        const { data } =
          await api.put(
            "/cart/update",
            {
              userId:
                user._id,
              productId,
              variantSize,
              quantity:
                item.quantity + 1,
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
    async (
      productId,
      variantSize
    ) => {

      // GUEST
      if (!user) {

        const item =
          cartItems.find(
            (item) =>
              item.productId ===
                productId &&
              item.variantSize ===
                variantSize
          );

        if (!item)
          return;

        if (
          item.quantity <= 1
        ) {

          removeFromCart(
            productId,
            variantSize
          );

          return;
        }

        setCartItems(
          cartItems.map(
            (item) =>
              item.productId ===
                productId &&
              item.variantSize ===
                variantSize
                ? {
                    ...item,
                    quantity:
                      item.quantity - 1,
                  }
                : item
          )
        );

        return;
      }

      // USER
      try {

        const item =
          cartItems.find(
            (item) =>
              item.productId ===
                productId &&
              item.variantSize ===
                variantSize
          );

        if (!item)
          return;

        if (
          item.quantity <= 1
        ) {

          removeFromCart(
            productId,
            variantSize
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
              variantSize,
              quantity:
                item.quantity - 1,
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
    async (
      productId,
      variantSize
    ) => {

      // GUEST
      if (!user) {

        setCartItems(
          cartItems.filter(
            (item) =>
              !(
                item.productId ===
                  productId &&
                item.variantSize ===
                  variantSize
              )
          )
        );

        return;
      }

      // USER
      try {

        const { data } =
          await api.delete(
            "/cart/remove",
            {
              data: {
                userId:
                  user._id,
                productId,
                variantSize,
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

      // GUEST
      if (!user) {

        setCartItems([]);

        return;
      }

      // USER
      try {

        await api.delete(
          "/cart/clear",
          {
            data: {
              userId:
                user._id,
            },
          }
        );

        setCartItems([]);

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
    async (product) => {

      // GUEST
      if (!user) {

        const exists =
          wishlistItems.find(
            (item) =>
              (
                item.product?._id ||
                item._id
              ) === product._id
          );

        if (exists)
          return;

        setWishlistItems([
          ...wishlistItems,
          product,
        ]);

        return;
      }

      // USER
      try {

        await api.post(
          "/wishlist/add",
          {
            userId:
              user._id,
            productId:
              product._id,
          }
        );

        await fetchWishlist();

      } catch (error) {

        console.log(
          "ADD WISHLIST ERROR:",
          error.response?.data ||
            error
        );
      }
    };

  // =========================
  // REMOVE FROM WISHLIST
  // =========================
  const removeFromWishlist =
    async (productId) => {

      // GUEST
      if (!user) {

        setWishlistItems(
          wishlistItems.filter(
            (item) =>
              (
                item.product?._id ||
                item._id
              ) !== productId
          )
        );

        return;
      }

      // USER
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

        setWishlistItems(
          wishlistItems.filter(
            (item) =>
              (
                item.product?._id ||
                item._id
              ) !== productId
          )
        );

      } catch (error) {

        console.log(
          "REMOVE WISHLIST ERROR:",
          error
        );
      }
    };

  // =========================
  // MARK NOTIFICATION READ
  // =========================
  const markNotificationAsRead =
    async (id) => {

      try {

        await api.put(
          `/notifications/read/${id}`
        );

        setNotifications(
          (prev) =>
            prev.map((item) =>
              item._id === id
                ? {
                    ...item,
                    isRead: true,
                  }
                : item
            )
        );

        setUnreadNotificationCount(
          (prev) =>
            prev > 0
              ? prev - 1
              : 0
        );

      } catch (error) {

        console.log(
          "MARK READ ERROR:",
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

      localStorage.removeItem(
        "user"
      );

      localStorage.removeItem(
        "token"
      );

      setNotifications([]);

      setUnreadNotificationCount(
        0
      );
    };

  // =========================
  // CONTEXT VALUE
  // =========================
  const value = {

    products,
    categories,
    loadingProducts,

    cartItems,
    wishlistItems,

    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,

    addToWishlist,
    removeFromWishlist,

    notifications,
    unreadNotificationCount,

    fetchNotifications,
    markNotificationAsRead,

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