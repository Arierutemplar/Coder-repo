const { initializeApp } = require("firebase-admin/app");
const { FieldValue, getFirestore } = require("firebase-admin/firestore");
const { HttpsError, onCall } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const { onSchedule } = require("firebase-functions/v2/scheduler");

initializeApp();
setGlobalOptions({ region: "us-central1", maxInstances: 10 });

const db = getFirestore();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const requestIdPattern = /^[a-f0-9-]{36}$/i;

const validateRequest = (data) => {
  const buyer = data?.buyer;
  const items = data?.items;
  if (
    !buyer ||
    typeof buyer.name !== "string" ||
    buyer.name.trim().length < 2 ||
    buyer.name.length > 120 ||
    typeof buyer.phone !== "string" ||
    buyer.phone.trim().length < 7 ||
    buyer.phone.length > 30 ||
    typeof buyer.email !== "string" ||
    buyer.email.length > 254 ||
    !emailPattern.test(buyer.email)
  ) {
    throw new HttpsError("invalid-argument", "Los datos de contacto no son válidos.");
  }
  if (
    !requestIdPattern.test(data.requestId ?? "") ||
    !Array.isArray(items) ||
    items.length < 1 ||
    items.length > 20
  ) {
    throw new HttpsError("invalid-argument", "El pedido no es válido.");
  }

  const seenIds = new Set();
  for (const item of items) {
    if (
      !item ||
      typeof item.id !== "string" ||
      item.id.length < 1 ||
      item.id.length > 150 ||
      !Number.isSafeInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 99 ||
      seenIds.has(item.id)
    ) {
      throw new HttpsError("invalid-argument", "Hay productos o cantidades no válidos.");
    }
    seenIds.add(item.id);
  }

  return {
    buyer: {
      name: buyer.name.trim(),
      phone: buyer.phone.trim(),
      email: buyer.email.trim().toLowerCase(),
    },
    items,
  };
};

exports.createOrder = onCall({ enforceAppCheck: true }, async ({ data }) => {
  const { buyer, items } = validateRequest(data);
  const orderRef = db.collection("orders").doc(data.requestId);
  const itemRefs = items.map(({ id }) => db.collection("items").doc(id));

  return db.runTransaction(async (transaction) => {
    const existingOrder = await transaction.get(orderRef);
    if (existingOrder.exists) {
      return { orderId: existingOrder.id, total: existingOrder.data().total };
    }

    const snapshots = [];
    for (const ref of itemRefs) snapshots.push(await transaction.get(ref));

    const orderItems = items.map((requested, index) => {
      const snapshot = snapshots[index];
      if (!snapshot.exists) {
        throw new HttpsError("not-found", "Uno de los productos ya no existe.");
      }
      const product = snapshot.data();
      if (
        typeof product.title !== "string" ||
        !Number.isFinite(product.price) ||
        product.price < 0 ||
        !Number.isSafeInteger(product.stock) ||
        product.stock < requested.quantity
      ) {
        throw new HttpsError(
          "failed-precondition",
          `${product.title || "Un producto"} ya no tiene stock suficiente.`,
        );
      }
      return {
        ref: snapshot.ref,
        id: snapshot.id,
        title: product.title,
        price: product.price,
        quantity: requested.quantity,
        subtotalCents: Math.round(product.price * 100) * requested.quantity,
        stock: product.stock,
      };
    });

    const totalCents = orderItems.reduce((sum, item) => sum + item.subtotalCents, 0);
    const order = {
      buyer,
      items: orderItems.map(({ id, title, price, quantity, subtotalCents }) => ({
        id,
        title,
        price,
        quantity,
        subtotal: subtotalCents / 100,
      })),
      total: totalCents / 100,
      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
    };

    for (const item of orderItems) {
      transaction.update(item.ref, { stock: item.stock - item.quantity });
    }
    transaction.create(orderRef, order);
    return { orderId: orderRef.id, total: order.total };
  });
});

exports.expirePendingOrders = onSchedule("every 60 minutes", async () => {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  const pendingOrders = await db
    .collection("orders")
    .where("status", "==", "pending")
    .limit(100)
    .get();

  for (const orderSnapshot of pendingOrders.docs) {
    await db.runTransaction(async (transaction) => {
      const currentOrder = await transaction.get(orderSnapshot.ref);
      if (!currentOrder.exists || currentOrder.data().status !== "pending") return;

      const order = currentOrder.data();
      if (!order.createdAt || order.createdAt.toMillis() > cutoff) return;

      const items = Array.isArray(order.items) ? order.items : [];
      const productSnapshots = [];
      for (const item of items) {
        if (typeof item.id !== "string" || !Number.isSafeInteger(item.quantity)) {
          continue;
        }
        const productRef = db.collection("items").doc(item.id);
        productSnapshots.push({
          item,
          snapshot: await transaction.get(productRef),
        });
      }

      for (const { item, snapshot } of productSnapshots) {
        if (
          snapshot.exists &&
          Number.isSafeInteger(snapshot.data().stock) &&
          item.quantity > 0
        ) {
          transaction.update(snapshot.ref, {
            stock: snapshot.data().stock + item.quantity,
          });
        }
      }

      transaction.update(orderSnapshot.ref, {
        status: "expired",
        expiredAt: FieldValue.serverTimestamp(),
      });
    });
  }
});
