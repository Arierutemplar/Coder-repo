import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import ItemListContainer from './components/ItemListContainer'
import NavbarRB from './components/NavbarRB';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ItemDetailContainer from './components/ItemDetailContainer';
import Error from './components/Error';
import { useState } from 'react';
//4. IMPORT EL PROVEEDOR, ARA DAR ACCESO AL CONTEXT
import { CartProvider } from './context/CartContext';
import CartContainer from './components/CartContainer';
import Checkout from './components/Checkout';
function App() {

console.log('soyApp')
  return (
  <BrowserRouter>
    <CartProvider>
    <NavbarRB />
    <Routes>
        <Route path='/' element={  <ItemListContainer greeting="Bienvenidos a mi App!"/>}/>
        <Route path='/category/:type' element={  <ItemListContainer greeting="Categoría: "/>}/>
        <Route path='/item/:id' element={ <ItemDetailContainer /> }/>
        <Route path='/cart' element={ <CartContainer /> }/>
        <Route path='/checkout' element={<Checkout/>}/>
        <Route path='*' element={<Error/>}/>
    </Routes>
    </CartProvider>
    </BrowserRouter>
  )
}

export default App
