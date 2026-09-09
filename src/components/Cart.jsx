import { useState } from "react";
import {
  Container,
  Table,
  Button,
  Row,
  Col,
  Card,
  Spinner,
  Modal,
  Form,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useCartContext } from "../context/CartContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";
import { Trash2, ArrowLeft, CheckCircle, UserCheck } from "lucide-react";

const Cart = () => {
  const { cart, removeItem, clear, totalPrice } = useCartContext();
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Estado para los datos del comprador
  const [buyer, setBuyer] = useState({
    name: "",
    phone: "",
    email: "",
    confirmEmail: "",
  });

  const [formError, setFormError] = useState("");

  const handleInputChange = (e) => {
    setBuyer({
      ...buyer,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // Validaciones del formulario
    if (!buyer.name || !buyer.phone || !buyer.email || !buyer.confirmEmail) {
      setFormError("Por favor completa todos los campos del formulario.");
      return;
    }

    if (buyer.email !== buyer.confirmEmail) {
      setFormError("Los correos electrónicos no coinciden.");
      return;
    }

    setFormError("");
    setLoading(true);

    try {
      const orderRef = collection(db, "orders");
      const newOrder = await addDoc(orderRef, {
        buyer: {
          name: buyer.name,
          phone: buyer.phone,
          email: buyer.email,
        },
        items: cart.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
        total: totalPrice(),
        date: serverTimestamp(),
      });

      // Guardar en sessionStorage lo acumulado en esta sesión activa
      cart.forEach((item) => {
        const previousPurchases = parseInt(
          sessionStorage.getItem(`purchased_${item.id}`) || "0",
          10,
        );
        sessionStorage.setItem(
          `purchased_${item.id}`,
          (previousPurchases + item.quantity).toString(),
        );
      });

      setOrderId(newOrder.id);
      setShowModal(true);
      clear();
    } catch (error) {
      console.error("Error al procesar la compra:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/motocicletas");
  };

  if (cart.length === 0 && !showModal) {
    return (
      <Container className="py-5 text-center">
        <h2 className="fw-bold mb-3 text-light">Tu carrito está vacío 🛒</h2>
        <p className="text-secondary mb-4">
          Aún no has agregado ninguna motocicleta o refacción.
        </p>
        <Button
          as={Link}
          to="/motocicletas"
          variant="warning"
          size="lg"
          className="fw-bold text-uppercase"
        >
          Ir al Catálogo
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="fw-bold mb-4 border-bottom border-warning pb-2 text-light">
        Carrito de Compras
      </h2>

      <Row className="g-4">
        {/* Tabla de Productos */}
        <Col lg={7}>
          <Table
            responsive
            variant="dark"
            hover
            className="align-middle border border-secondary rounded"
          >
            <thead>
              <tr className="text-warning text-uppercase">
                <th>Producto</th>
                <th className="text-center">Precio</th>
                <th className="text-center">Cant.</th>
                <th className="text-center">Subtotal</th>
                <th className="text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((prod) => (
                <tr key={prod.id}>
                  <td className="d-flex align-items-center gap-3">
                    <img
                      src={prod.img}
                      alt={prod.title}
                      style={{
                        width: "60px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                      className="rounded border border-secondary"
                    />
                    <span className="fw-bold text-light">{prod.title}</span>
                  </td>
                  <td className="text-center text-light">
                    ${prod.price?.toLocaleString("es-MX")}
                  </td>
                  <td className="text-center fw-bold text-light">
                    {prod.quantity}
                  </td>
                  <td className="text-center text-warning fw-bold">
                    ${(prod.price * prod.quantity).toLocaleString("es-MX")}
                  </td>
                  <td className="text-center">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeItem(prod.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="d-flex justify-content-between align-items-center mt-3 mb-4 mb-lg-0">
            <Button
              as={Link}
              to="/motocicletas"
              variant="outline-warning"
              className="d-inline-flex align-items-center gap-2"
            >
              <ArrowLeft size={18} /> Seguir Comprando
            </Button>
            <Button variant="outline-danger" onClick={clear}>
              Vaciar Carrito
            </Button>
          </div>
        </Col>

        {/* Formulario y Resumen */}
        <Col lg={5}>
          <Card bg="dark" text="white" className="border-secondary shadow p-3">
            <Card.Body>
              <Card.Title className="fw-bold border-bottom border-secondary pb-2 mb-3 d-flex align-items-center gap-2">
                <UserCheck size={20} className="text-warning" /> Datos de
                Contacto
              </Card.Title>

              <Form onSubmit={handleCheckout}>
                <Form.Group className="mb-3">
                  <Form.Label className="small text-secondary mb-1">
                    Nombre Completo
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Ej. Juan Pérez"
                    value={buyer.name}
                    onChange={handleInputChange}
                    bg="dark"
                    className="bg-dark text-light border-secondary"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="small text-secondary mb-1">
                    Teléfono
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    placeholder="Ej. 9991234567"
                    value={buyer.phone}
                    onChange={handleInputChange}
                    className="bg-dark text-light border-secondary"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="small text-secondary mb-1">
                    Correo Electrónico
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="correo@ejemplo.com"
                    value={buyer.email}
                    onChange={handleInputChange}
                    className="bg-dark text-light border-secondary"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="small text-secondary mb-1">
                    Confirmar Correo Electrónico
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="confirmEmail"
                    placeholder="Repite tu correo"
                    value={buyer.confirmEmail}
                    onChange={handleInputChange}
                    className="bg-dark text-light border-secondary"
                    required
                  />
                </Form.Group>

                {formError && (
                  <p className="text-danger small fw-bold mb-3">{formError}</p>
                )}

                <div className="border-top border-secondary pt-3 mt-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-secondary">Envío:</span>
                    <span className="text-success fw-bold">¡GRATIS!</span>
                  </div>

                  <div className="d-flex justify-content-between fs-4 fw-bold mb-4">
                    <span>Total:</span>
                    <span className="text-warning">
                      ${totalPrice().toLocaleString("es-MX")} MXN
                    </span>
                  </div>

                  <Button
                    type="submit"
                    variant="warning"
                    size="lg"
                    className="w-100 fw-bold text-uppercase d-flex align-items-center justify-content-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      <>
                        <CheckCircle size={20} /> Finalizar Compra
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de Confirmación */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        data-bs-theme="dark"
      >
        <Modal.Header
          closeButton
          className="border-secondary bg-dark text-light"
        >
          <Modal.Title className="d-flex align-items-center gap-2 text-warning fw-bold">
            <CheckCircle className="text-success" size={26} /> ¡Compra
            Procesada!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light text-center py-4">
          <p className="fs-5 mb-1">
            ¡Gracias por tu compra,{" "}
            <strong className="text-warning">{buyer.name}</strong>!
          </p>
          <p className="text-secondary small mb-3">
            Enviaremos la confirmación a <strong>{buyer.email}</strong>
          </p>
          <p className="text-secondary mb-1">ID de confirmación de tu orden:</p>
          <div className="p-2 bg-black bg-opacity-50 border border-secondary rounded text-warning fw-bold font-monospace fs-5">
            {orderId}
          </div>
        </Modal.Body>
        <Modal.Footer className="border-secondary bg-dark justify-content-center">
          <Button
            variant="warning"
            className="fw-bold text-uppercase px-4"
            onClick={handleCloseModal}
          >
            Volver a la Tienda
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Cart;
