import { useState, useEffect } from "react";
import { CartContext } from "./cartContextStore";
import {
  addProductToCart,
  getCartTotals,
  readStoredCart,
  updateCartQuantity,
} from "../utils/cart";

export const CartProvider = ({ children }) => {
  // Inicializa el estado leyendo directamente de localStorage
  const [cart, setCart] = useState(() => {
    return readStoredCart(localStorage.getItem("moto_store_cart"));
  });

  // Guarda en localStorage cada vez que el carrito cambia
  useEffect(() => {
    localStorage.setItem("moto_store_cart", JSON.stringify(cart));
  }, [cart]);

  const addItem = (item, quantity) => {
    setCart((prevCart) => addProductToCart(prevCart, item, quantity));
  };

  const setItemQuantity = (id, quantity) => {
    setCart((prevCart) => updateCartQuantity(prevCart, id, quantity));
  };

  const removeItem = (id) => {
    setCart((prevCart) => prevCart.filter((prod) => prod.id !== id));
  };

  const clear = () => {
    setCart([]);
    localStorage.removeItem("moto_store_cart");
  };

  const totals = getCartTotals(cart);

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        setItemQuantity,
        clear,
        totalQuantity: () => totals.quantity,
        totalPrice: () => totals.price,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
