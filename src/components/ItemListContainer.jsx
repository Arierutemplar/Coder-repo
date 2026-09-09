import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../services/firebase";
import {
  Container,
  Spinner,
  Form,
  InputGroup,
  Row,
  Col,
  Card,
  Button,
  Badge,
} from "react-bootstrap";
import { Search, Eye } from "lucide-react";

const ItemListContainer = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true);
    const itemsRef = collection(db, "items");
    const q = categoryId
      ? query(itemsRef, where("category", "==", categoryId))
      : itemsRef;

    getDocs(q)
      .then((snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(docs);
      })
      .catch((err) => console.error("Error al obtener productos:", err))
      .finally(() => setLoading(false));
  }, [categoryId]);

  const filteredProducts = products.filter((prod) =>
    prod.title?.toLowerCase().includes(searchTerm.toLowerCase().trim()),
  );

  return (
    <Container className="py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-2 border-bottom border-warning gap-3">
        <h2 className="fw-bold text-light m-0 text-uppercase">
          {categoryId ? `Catálogo: ${categoryId}` : "Catálogo Completo"}
        </h2>

        {/* Barra de Búsqueda Dinámica */}
        <div style={{ maxWidth: "320px" }} className="w-100">
          <InputGroup>
            <InputGroup.Text className="bg-dark border-secondary text-warning">
              <Search size={18} />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Buscar modelo o refacción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-dark text-light border-secondary shadow-none"
            />
          </InputGroup>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="warning" />
          <p className="mt-3 text-light">Cargando catálogo...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-secondary fs-5">
            {searchTerm
              ? `No se encontraron resultados para "${searchTerm}"`
              : "No hay productos disponibles en esta categoría."}
          </p>
        </div>
      ) : (
        <Row className="g-4">
          {filteredProducts.map((prod) => (
            <Col key={prod.id} sm={6} md={4} lg={3}>
              <Card
                bg="dark"
                text="white"
                className="h-100 border-secondary shadow-sm hover-shadow"
              >
                <Card.Img
                  variant="top"
                  src={prod.img}
                  alt={prod.title}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <Badge
                      bg="warning"
                      text="dark"
                      className="text-uppercase mb-2"
                    >
                      {prod.category || "Motocicletas"}
                    </Badge>
                    <Card.Title className="fw-bold fs-5 text-light">
                      {prod.title}
                    </Card.Title>
                    <Card.Text className="text-warning fw-bold fs-5 my-2">
                      ${prod.price?.toLocaleString("es-MX")} MXN
                    </Card.Text>
                  </div>
                  <Button
                    as={Link}
                    to={`/item/${prod.id}`}
                    variant="outline-warning"
                    className="w-100 fw-bold mt-3 d-flex align-items-center justify-content-center gap-2"
                  >
                    <Eye size={18} /> Ver Detalle
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default ItemListContainer;
