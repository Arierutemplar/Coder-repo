import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavbarRB from "./components/NavbarRB";
import Home from "./components/Home";
import { CartProvider } from "./context/CartContext";
import ItemListContainer from "./components/ItemListContainer";
import ItemDetailContainer from "./components/ItemDetailContainer";
import Cart from "./components/Cart";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="bg-dark min-vh-100 text-white">
          <NavbarRB />
          <Routes>
            <Route path="/cart" element={<Cart />} />
            <Route path="/item/:id" element={<ItemDetailContainer />} />
            <Route path="/motocicletas" element={<ItemListContainer />} />
            <Route path="/" element={<Home />} />
            <Route
              path="/motocicletas"
              element={
                <div className="container py-5">
                  <h2>Catálogo de Motocicletas (Firebase)</h2>
                </div>
              }
            />
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
              path="/cart"
              element={
                <div className="container py-5">
                  <h2>Carrito de Compras</h2>
                </div>
              }
            />
          </Routes>
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
