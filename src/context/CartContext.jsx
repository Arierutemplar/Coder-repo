import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCartContext = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Inicializa el estado leyendo directamente de localStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("moto_store_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Guarda en localStorage cada vez que el carrito cambia
  useEffect(() => {
    localStorage.setItem("moto_store_cart", JSON.stringify(cart));
  }, [cart]);

  const addItem = (item, quantity) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((prod) => prod.id === item.id);
      if (existingItem) {
        return prevCart.map((prod) =>
          prod.id === item.id
            ? { ...prod, quantity: prod.quantity + quantity }
            : prod,
        );
      }
      return [...prevCart, { ...item, quantity }];
    });
  };

  const removeItem = (id) => {
    setCart((prevCart) => prevCart.filter((prod) => prod.id !== id));
  };

  const clear = () => {
    setCart([]);
    localStorage.removeItem("moto_store_cart");
  };

  const totalQuantity = () => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  };

  const totalPrice = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        clear,
        totalQuantity,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
