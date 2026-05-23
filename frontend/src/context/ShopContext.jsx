import {
  createContext,
  useState,
} from "react";

import {
  dummyProducts,
} from "../assets/greencart_assets/assets";

export const ShopContext = createContext();

const ShopContextProvider = ({
  children,
}) => {
  const [products] = useState(dummyProducts);

  const [cartItems, setCartItems] =
    useState([]);

  const [user, setUser] =
    useState(
      JSON.parse(
        localStorage.getItem("user")
      ) || null
    );

  // Add to Cart
  const addToCart = (product) => {
    setCartItems((prev) => [
      ...prev,
      product,
    ]);
  };

  // Login User
  const loginUser = (userData) => {
    setUser(userData);
  };

  // Logout User
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const value = {
    products,
    cartItems,
    addToCart,

    user,
    loginUser,
    logoutUser,
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;