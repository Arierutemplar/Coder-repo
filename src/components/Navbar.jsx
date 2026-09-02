//ARRIBA DE LA DECLARACION DEL COMPONENTE HACEMOS LOS IMPORTS
//IMPORT CSS
import "../styles/Navbar.css"
//IMAGEN EN SRC
import logoShop from "../assets/img/logo-shop.png"
import CartWidget from "./CartWidget"
import { NavLink } from "react-router-dom"

//DECLARACION DEL COMPONENTE:
const Navbar = ()=> {
   console.log('nAVBAR')
    return(
        <nav className="nav-container">
            {/* <a className='anchor-nav' href="">Coder Shop</a> */}
            {/* IMAGEN DENTRO DE PUBLIC */}
            {/* <img src='../favicon.svg' alt='logo'/> */}
            {/* IMAGEN DENTRO DE SRC */}
            <NavLink to='/'>
             <img src={logoShop} alt='logo' className="logo"/>
            </NavLink>
            <NavLink className='anchor-nav' to="/category/nuevos">Nuevos</NavLink>
            <NavLink className='anchor-nav' to="/category/ofertas">Ofertas</NavLink>
            <NavLink className='anchor-nav' to="/category/mas vendidos">Mas vendidos</NavLink>
            <CartWidget/>
        </nav>
    )
}

export default Navbar