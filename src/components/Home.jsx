import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-dark text-white py-5 min-vh-100 d-flex align-items-center">
      <Container>
        <Row className="align-items-center">
          <Col lg={6} className="mb-5 mb-lg-0">
            <h1 className="display-3 fw-bold mb-3">
              Moto Store <span className="text-warning">MX</span>
            </h1>
            <h2 className="h3 text-light mb-4">
              Refacciones, motocicletas y accesorios.
            </h2>
            <p className="lead text-secondary mb-4">
              Todo para tu moto, en un solo lugar. Recorre nuestra tienda en
              línea y encuentra miles de productos listos para envío a todo
              México.
            </p>
            <Button
              as={Link}
              to="/motocicletas"
              variant="warning"
              size="lg"
              className="fw-bold px-4 py-3 rounded-pill text-uppercase"
            >
              Ver Catálogo
            </Button>
          </Col>
          <Col lg={6} className="text-center">
            <img
              src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=800&auto=format&fit=crop"
              alt="Moto Banner"
              className="img-fluid rounded shadow-lg border border-secondary"
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
