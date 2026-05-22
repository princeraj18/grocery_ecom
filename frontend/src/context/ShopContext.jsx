import {
  createContext,
  useEffect,
  useState,
} from "react";

import api from "../api/Axios";

export const ShopContext = createContext();

const ShopContextProvider = ({
  children,
}) => {
  // ================= USER =================
  const [user, setUser] = useState(() => {
    const savedUser =
      localStorage.getItem("user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  // ================= CART =================
  const [cartItems, setCartItems] =
    useState([]);

  // ================= GUEST ID =================
  const getOrCreateGuestId = () => {
    let guestId =
      localStorage.getItem("guestId");

    if (!guestId) {
      guestId = `guest_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 9)}`;

      localStorage.setItem(
        "guestId",
        guestId
      );
    }

    return guestId;
  };

  // ================= LOAD CART =================
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const id =
          user?._id ||
          getOrCreateGuestId();

        const res = await api.get(
          `/cart/${id}`
        );

        console.log(
          "FETCH CART:",
          res.data
        );

        if (res.data.success) {
          setCartItems(
            res.data.cart?.items || []
          );
        } else {
          setCartItems([]);
        }
      } catch (error) {
        console.log(
          "Fetch Cart Error:",
          error
        );

        setCartItems([]);
      }
    };

    fetchCart();
  }, [user]);

  // ================= SAVE USER =================
  useEffect(() => {
    if (user) {
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // ================= LOGIN =================
  const loginUser = (userData) => {
    setUser(userData);
  };

  // ================= LOGOUT =================
  const logoutUser = () => {
    setUser(null);
    setCartItems([]);
  };

  // ================= UPDATE USER =================
  const updateUser = (
    updatedData
  ) => {
    setUser((prev) => ({
      ...prev,
      ...updatedData,
    }));
  };

  // ================= ADD TO CART =================
  const addToCart = async (
    product,
    quantity = 1
  ) => {
    try {
      const id =
        user?._id ||
        getOrCreateGuestId();

      const productToSend = {
        productId: product._id,
        name: product.name,
        image: Array.isArray(
          product.image
        )
          ? product.image[0]
          : product.image,
        price:
          product.offerPrice ||
          product.price,
        quantity,
        category: product.category,
      };

      const res = await api.post(
        "/cart/add",
        {
          userId: id,
          product: productToSend,
        }
      );

      console.log(
        "ADD CART RESPONSE:",
        res.data
      );

      if (res.data.success) {
        setCartItems(
          res.data.cart.items
        );
      }
    } catch (error) {
      console.log(
        "Add To Cart Error:",
        error.response?.data ||
          error.message
      );
    }
  };

  // ================= REMOVE FROM CART =================
  const removeFromCart = async (
    productId
  ) => {
    try {
      const id =
        user?._id ||
        getOrCreateGuestId();

      const res = await api.delete(
        "/cart/remove",
        {
          data: {
            userId: id,
            productId,
          },
        }
      );

      if (res.data.success) {
        setCartItems(
          res.data.cart.items
        );
      }
    } catch (error) {
      console.log(
        "Remove Cart Error:",
        error
      );
    }
  };

  // ================= INCREASE QUANTITY =================
  const increaseQuantity =
    async (productId) => {
      try {
        const id =
          user?._id ||
          getOrCreateGuestId();

        const item = cartItems.find(
          (it) =>
            it.productId === productId
        );

        if (!item) return;

        const res = await api.put(
          "/cart/update",
          {
            userId: id,
            productId,
            quantity:
              item.quantity + 1,
          }
        );

        if (res.data.success) {
          setCartItems(
            res.data.cart.items
          );
        }
      } catch (error) {
        console.log(
          "Increase Quantity Error:",
          error
        );
      }
    };

  // ================= DECREASE QUANTITY =================
  const decreaseQuantity =
    async (productId) => {
      try {
        const id =
          user?._id ||
          getOrCreateGuestId();

        const item = cartItems.find(
          (it) =>
            it.productId === productId
        );

        if (!item) return;

        if (item.quantity <= 1) {
          removeFromCart(productId);
          return;
        }

        const res = await api.put(
          "/cart/update",
          {
            userId: id,
            productId,
            quantity:
              item.quantity - 1,
          }
        );

        if (res.data.success) {
          setCartItems(
            res.data.cart.items
          );
        }
      } catch (error) {
        console.log(
          "Decrease Quantity Error:",
          error
        );
      }
    };

  // ================= CLEAR CART =================
  const clearCart = async () => {
    try {
      const id =
        user?._id ||
        getOrCreateGuestId();

      await api.delete(
        `/cart/clear/${id}`
      );

      setCartItems([]);
    } catch (error) {
      console.log(
        "Clear Cart Error:",
        error
      );
    }
  };

  return (
    <ShopContext.Provider
      value={{
        // USER
        user,
        setUser,
        loginUser,
        logoutUser,
        updateUser,

        // CART
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;