import { useContext } from "react";
import { CartContext } from "./cartContextStore";

export const useCartContext = () => useContext(CartContext);
