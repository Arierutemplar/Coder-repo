export const isValidProduct = (product) =>
  product &&
  typeof product.id === "string" &&
  typeof product.title === "string" &&
  Number.isFinite(product.price) &&
  product.price >= 0 &&
  Number.isSafeInteger(product.stock) &&
  product.stock >= 0;

export const readStoredCart = (serializedCart) => {
  if (!serializedCart) return [];

  try {
    const parsedCart = JSON.parse(serializedCart);
    if (!Array.isArray(parsedCart)) return [];
    return parsedCart.filter(
      (item) =>
        isValidProduct(item) &&
        Number.isSafeInteger(item.quantity) &&
        item.quantity > 0 &&
        item.quantity <= item.stock,
    );
  } catch {
    return [];
  }
};

export const addProductToCart = (cart, product, quantity) => {
  if (
    !isValidProduct(product) ||
    !Number.isSafeInteger(quantity) ||
    quantity < 1
  ) {
    return cart;
  }

  const currentQuantity =
    cart.find((item) => item.id === product.id)?.quantity ?? 0;
  if (currentQuantity + quantity > product.stock) return cart;

  if (currentQuantity > 0) {
    return cart.map((item) =>
      item.id === product.id
        ? { ...product, quantity: currentQuantity + quantity }
        : item,
    );
  }

  return [...cart, { ...product, quantity }];
};

export const updateCartQuantity = (cart, id, quantity) => {
  if (!Number.isSafeInteger(quantity)) return cart;
  if (quantity < 1) return cart.filter((item) => item.id !== id);

  return cart.map((item) =>
    item.id === id
      ? { ...item, quantity: Math.min(quantity, item.stock) }
      : item,
  );
};

export const getCartTotals = (cart) =>
  cart.reduce(
    (totals, item) => ({
      quantity: totals.quantity + item.quantity,
      price: totals.price + item.price * item.quantity,
    }),
    { quantity: 0, price: 0 },
  );
