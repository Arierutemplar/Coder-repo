import { lazy, Suspense } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavbarRB from "./components/NavbarRB";
import { CartProvider } from "./context/CartContext";
import { Container, Spinner } from "react-bootstrap";

const Home = lazy(() => import("./components/Home"));
const ItemListContainer = lazy(() => import("./components/ItemListContainer"));
const ItemDetailContainer = lazy(
  () => import("./components/ItemDetailContainer"),
);
const Cart = lazy(() => import("./components/Cart"));

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="bg-dark min-vh-100 text-white">
          <NavbarRB />
          <Suspense
            fallback={
              <Container className="py-5 text-center" role="status">
                <Spinner animation="border" variant="warning" />
                <p className="mt-3 text-light">Cargando página...</p>
              </Container>
            }
          >
            <Routes>
              <Route path="/cart" element={<Cart />} />
              <Route path="/item/:id" element={<ItemDetailContainer />} />
              <Route path="/motocicletas" element={<ItemListContainer />} />
              <Route path="/" element={<Home />} />
              <Route
                path="/tienda"
                element={
                  <div className="container py-5">
                    <h2>Sección Tienda</h2>
                  </div>
                }
              />
              <Route
                path="/refacciones"
                element={
                  <div className="container py-5">
                    <h2>Sección Refacciones</h2>
                  </div>
                }
              />
              <Route
                path="/contacto"
                element={
                  <div className="container py-5">
                    <h2>Sección Contacto</h2>
                  </div>
                }
              />
              <Route
                path="/login"
                element={
                  <div className="container py-5">
                    <h2>Inicio / Registro</h2>
                  </div>
                }
              />
              <Route
                path="*"
                element={
                  <div className="container py-5 text-center">
                    <h1 className="text-warning">Página no encontrada</h1>
                    <p className="text-secondary">
                      La dirección que buscas no existe.
                    </p>
                  </div>
                }
              />
            </Routes>
          </Suspense>
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
