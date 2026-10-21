import { useEffect, useMemo, useState } from "react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("featured");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [catalogState, setCatalogState] = useState({
    categoryId: undefined,
    loaded: false,
    products: [],
    error: null,
  });
  const { categoryId } = useParams();

  useEffect(() => {
    const itemsRef = collection(db, "items");
    const q = categoryId
      ? query(itemsRef, where("category", "==", categoryId))
      : itemsRef;

    let active = true;
    getDocs(q)
      .then((snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (active) {
          setCatalogState({ categoryId, products: docs, error: null, loaded: true });
        }
      })
      .catch((err) => {
        console.error("Error al obtener productos:", err);
        if (active) {
          setCatalogState({ categoryId, products: [], error: err, loaded: true });
        }
      });

    return () => {
      active = false;
    };
  }, [categoryId]);

  const loading = !catalogState.loaded || catalogState.categoryId !== categoryId;
  const error = loading ? null : catalogState.error;
  const products = useMemo(
    () => (loading ? [] : catalogState.products),
    [loading, catalogState.products],
  );
  const categories = useMemo(
    () =>
      [
        ...new Set(
          products
            .map((product) => product.category)
            .filter((category) => typeof category === "string" && category),
        ),
      ].sort(),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase("es-MX");
    const result = products.filter((product) => {
      const matchesSearch = [product.title, product.description, product.category]
        .some(
          (value) =>
            typeof value === "string" &&
            value.toLocaleLowerCase("es-MX").includes(normalizedSearch),
        );

      return (
        matchesSearch &&
        (!selectedCategory || product.category === selectedCategory) &&
        (!inStockOnly || product.stock > 0)
      );
    });

    return result.sort((first, second) => {
      if (sortOrder === "price-asc") return (first.price ?? 0) - (second.price ?? 0);
      if (sortOrder === "price-desc") return (second.price ?? 0) - (first.price ?? 0);
      if (sortOrder === "name") {
        return (first.title ?? "").localeCompare(second.title ?? "", "es-MX");
      }
      return 0;
    });
  }, [products, searchTerm, selectedCategory, inStockOnly, sortOrder]);

  return (
    <Container className="py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-2 border-bottom border-warning gap-3">
        <h2 className="fw-bold text-light m-0 text-uppercase">
          {categoryId ? `Catálogo: ${categoryId}` : "Catálogo Completo"}
        </h2>

        {/* Barra de Búsqueda Dinámica */}
        <div className="w-100 catalog-search">
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

      <Row className="g-2 mb-4">
        <Col sm={6} lg={3}>
          <Form.Select
            aria-label="Filtrar por categoría"
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className="bg-dark text-light border-secondary"
          >
            <option value="">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col sm={6} lg={3}>
          <Form.Select
            aria-label="Ordenar productos"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
            className="bg-dark text-light border-secondary"
          >
            <option value="featured">Orden recomendado</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
            <option value="name">Nombre: A-Z</option>
          </Form.Select>
        </Col>
        <Col sm={12} lg={3} className="d-flex align-items-center">
          <Form.Check
            type="switch"
            id="in-stock-filter"
            label="Solo disponibles"
            checked={inStockOnly}
            onChange={(event) => setInStockOnly(event.target.checked)}
            className="text-light"
          />
        </Col>
        <Col
          sm={12}
          lg={3}
          className="text-lg-end text-secondary align-self-center"
          aria-live="polite"
        >
          {filteredProducts.length} productos
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="warning" />
          <p className="mt-3 text-light">Cargando catálogo...</p>
        </div>
      ) : error ? (
        <div className="text-center py-5" role="alert">
          <p className="text-danger fs-5">
            No se pudieron cargar los productos desde Firestore.
          </p>
          <p className="text-secondary">{error.message}</p>
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
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.src = "/favicon.svg";
                  }}
                  className="catalog-product-image"
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
                    <small className={prod.stock > 0 ? "text-success" : "text-danger"}>
                      {prod.stock > 0
                        ? `Disponible · ${prod.stock} en existencia`
                        : "Agotado"}
                    </small>
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
