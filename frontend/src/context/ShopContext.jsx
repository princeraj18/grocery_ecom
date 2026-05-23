import {
  createContext,
  useState,
} from "react";

import {
  dummyProducts,
} from "../assets/greencart_assets/assets";

export const ShopContext =
  createContext();

const ShopContextProvider = ({
  children,
}) => {
  const [products] =
    useState(dummyProducts);

  const [cartItems, setCartItems] =
    useState([]);

  // =========================
  // ADD TO CART
  // =========================
  const addToCart = (product) => {
    setCartItems((prev) => [
      ...prev,
      product,
    ]);
  };

  const value = {
    products,
    cartItems,
    addToCart,
  };

  return (
    <ShopContext.Provider
      value={value}
    >
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;