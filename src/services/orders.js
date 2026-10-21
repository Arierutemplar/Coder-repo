import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

const createOrderRequest = httpsCallable(functions, "createOrder");

export const submitOrder = async ({ buyer, items, requestId }) => {
  const result = await createOrderRequest({ buyer, items, requestId });
  return result.data;
};
