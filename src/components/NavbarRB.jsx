import { Navbar, Nav, Container, Badge } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { Search, ShoppingCart } from "lucide-react";
import { useCartContext } from "../context/useCartContext";

const NavbarRB = () => {
  const { totalQuantity, totalPrice } = useCartContext();

  return (
    <>
      <div className="bg-warning text-dark text-center py-1 fw-bold fs-6">
        ¡Envíos a toda la república mexicana!
      </div>

      <Navbar
        bg="dark"
        variant="dark"
        expand="xl"
        className="px-3 py-2 sticky-top border-bottom border-secondary"
      >
        <Container fluid className="px-2">
          {/* Logo */}
          <Navbar.Brand
            as={Link}
            to="/"
            className="fw-bold fs-4 text-uppercase me-3"
          >
            MOTO STORE <span className="text-warning">MX</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            {/* Menú de Navegación Centrado */}
            <Nav
              className="mx-auto gap-2 text-uppercase fw-semibold main-navigation"
            >
              <Nav.Link as={NavLink} to="/" end>
                Inicio
              </Nav.Link>
              <Nav.Link as={NavLink} to="/tienda">
                Tienda
              </Nav.Link>
              <Nav.Link as={NavLink} to="/motocicletas">
                Motocicletas
              </Nav.Link>
              <Nav.Link as={NavLink} to="/refacciones">
                Refacciones
              </Nav.Link>
              <Nav.Link as={NavLink} to="/contacto">
                Contacto
              </Nav.Link>
            </Nav>

            {/* Acceso e Íconos a la Derecha */}
            <div className="d-flex align-items-center gap-3 text-white mt-3 mt-xl-0">
              <Link
                to="/login"
                className="text-white text-decoration-none fw-bold account-link"
              >
                INICIO/REGISTRO
              </Link>

              <Search size={18} aria-hidden="true" />

              <Link
                to="/cart"
                className="text-white text-decoration-none d-flex align-items-center gap-2"
              >
                <div className="position-relative">
                  <ShoppingCart size={22} />
                  <Badge
                    bg="warning"
                    text="dark"
                    pill
                    className="position-absolute top-0 start-100 translate-middle"
                  >
                    {totalQuantity()}
                  </Badge>
                </div>
                <span className="fw-bold cart-total">
                  ${totalPrice().toLocaleString("es-MX")}
                </span>
              </Link>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavbarRB;
