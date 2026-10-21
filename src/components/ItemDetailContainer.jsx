import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useCartContext } from "../context/useCartContext";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Badge,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { ArrowLeft, ShoppingCart, CheckCircle2 } from "lucide-react";

const ItemDetailContainer = () => {
  const [productState, setProductState] = useState({
    id: null,
    product: null,
    error: null,
  });
  const [quantity, setQuantity] = useState(1);
  const [addedProductId, setAddedProductId] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const { id } = useParams();
  const { addItem, cart } = useCartContext();

  useEffect(() => {
    let active = true;
    const docRef = doc(db, "items", id);

    getDoc(docRef)
      .then((snapshot) => {
        if (!active) return;
        const product = snapshot.exists()
          ? { id: snapshot.id, ...snapshot.data() }
          : null;
        setProductState({ id, product, error: null });
      })
      .catch((err) => {
        console.error("Error al cargar producto:", err);
        if (active) setProductState({ id, product: null, error: err });
      });

    return () => {
      active = false;
    };
  }, [id]);

  const loading = productState.id !== id;
  const product = loading ? null : productState.product;
  const loadError = loading ? null : productState.error;
  const added = addedProductId === id;
  // Cálculo de stock disponible restando compras anteriores
  const itemInCart = cart.find((item) => item.id === id);
  const quantityInCart = itemInCart ? itemInCart.quantity : 0;
  const availableStock =
    product && Number.isSafeInteger(product.stock)
      ? Math.max(0, product.stock - quantityInCart)
      : 0;

  const handleAdd = () => {
    if (quantity < 1 || quantity > availableStock) return;
    addItem(product, quantity);
    setAddedProductId(id);
    setShowToast(true);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="warning" />
        <p className="mt-3 text-light">Cargando producto...</p>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-5 text-center">
        <h3 className="text-light">
          {loadError ? "No se pudo cargar el producto." : "El producto no existe."}
        </h3>
        {loadError && <p className="text-secondary">{loadError.message}</p>}
        <Button
          as={Link}
          to="/motocicletas"
          variant="warning"
          className="mt-3 fw-bold"
        >
          Volver al catálogo
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Button
        as={Link}
        to="/motocicletas"
        variant="outline-warning"
        className="mb-4 d-inline-flex align-items-center gap-2"
      >
        <ArrowLeft size={18} /> Volver al catálogo
      </Button>

      <Card bg="dark" text="white" className="border-secondary shadow-lg p-3">
        <Row className="g-4 align-items-center">
          <Col md={6}>
            <Card.Img
              src={product.img}
              alt={product.title}
              loading="lazy"
              onError={(event) => {
                event.currentTarget.src = "/favicon.svg";
              }}
              className="rounded border border-secondary img-fluid product-detail-image"
            />
          </Col>
          <Col md={6}>
            <Badge bg="warning" text="dark" className="text-uppercase mb-2">
              {product.category || "Motocicletas"}
            </Badge>
            <h1 className="fw-bold text-light mb-3">{product.title}</h1>
            <h2 className="text-warning fw-bold mb-3">
              ${product.price?.toLocaleString("es-MX")} MXN
            </h2>
            <p className="text-secondary fs-5 mb-4">{product.description}</p>

            <p className="small text-secondary mb-3">
              Stock disponible:{" "}
              <strong className="text-light">{availableStock} unidades</strong>
            </p>

            {availableStock <= 0 ? (
              <div className="p-3 border border-danger text-danger rounded bg-black bg-opacity-50 fw-bold">
                Agotado temporalmente
              </div>
            ) : added ? (
              <div className="d-flex flex-column gap-2">
                <Button
                  as={Link}
                  to="/cart"
                  variant="warning"
                  size="lg"
                  className="fw-bold text-uppercase"
                >
                  Terminar Mi Compra
                </Button>
                <Button
                  as={Link}
                  to="/motocicletas"
                  variant="outline-light"
                  size="sm"
                >
                  Seguir Comprando
                </Button>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center border border-secondary rounded bg-black bg-opacity-25">
                  <Button
                    variant="link"
                    aria-label="Disminuir cantidad"
                    className="text-warning text-decoration-none px-3 fs-4"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    -
                  </Button>
                  <span className="fw-bold px-2">{quantity}</span>
                  <Button
                    variant="link"
                    aria-label="Aumentar cantidad"
                    className="text-warning text-decoration-none px-3 fs-4"
                    onClick={() =>
                      setQuantity((q) => Math.min(availableStock, q + 1))
                    }
                  >
                    +
                  </Button>
                </div>

                <Button
                  variant="warning"
                  size="lg"
                  className="fw-bold text-uppercase d-flex align-items-center gap-2"
                  onClick={handleAdd}
                  disabled={quantity > availableStock}
                >
                  <ShoppingCart size={20} /> Agregar al Carrito
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </Card>

      {/* Contenedor de Toast flotante en esquina inferior derecha */}
      <ToastContainer
        position="bottom-end"
        className="p-3 product-toast-container"
      >
        <Toast
          bg="dark"
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3500}
          autohide
          className="border border-warning text-light"
        >
          <Toast.Header className="bg-warning text-dark fw-bold">
            <CheckCircle2 size={18} className="me-2" /> ¡Producto Agregado!
          </Toast.Header>
          <Toast.Body className="fw-bold">
            Se agregaron {quantity} unidad(es) de "{product.title}" al carrito.
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default ItemDetailContainer;
