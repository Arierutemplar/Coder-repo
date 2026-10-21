import assert from "node:assert/strict";
import test from "node:test";
import {
  addProductToCart,
  getCartTotals,
  readStoredCart,
  updateCartQuantity,
} from "./cart.js";

const product = { id: "moto-1", title: "Moto", price: 100, stock: 3 };

test("loads only valid persisted cart entries", () => {
  const cart = readStoredCart(
    JSON.stringify([
      { ...product, quantity: 2 },
      { ...product, id: "overstock", quantity: 4 },
      { ...product, id: "invalid", quantity: 0 },
    ]),
  );

  assert.deepEqual(cart.map((item) => item.id), ["moto-1"]);
  assert.deepEqual(readStoredCart("{invalid"), []);
});

test("does not allow adding more than available stock", () => {
  const cart = addProductToCart([], product, 2);
  assert.equal(addProductToCart(cart, product, 2), cart);
  assert.equal(addProductToCart(cart, product, 1)[0].quantity, 3);
});

test("updates quantities and calculates totals", () => {
  const cart = addProductToCart([], product, 2);
  assert.equal(updateCartQuantity(cart, product.id, 4)[0].quantity, 3);
  assert.deepEqual(getCartTotals(cart), { quantity: 2, price: 200 });
  assert.deepEqual(updateCartQuantity(cart, product.id, 0), []);
});
