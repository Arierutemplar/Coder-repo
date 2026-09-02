import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logoShop from '../assets/img/logo-shop.png'
import CartWidgetRI from './CartWidgetRI';
import { NavLink } from 'react-router-dom';

function NavbarRB() {
  console.log('soyNav')
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={NavLink} to='/'>
            <img src={logoShop} alt='logo' style={{width:'8rem'}}/>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to='/'>Home</Nav.Link>
            <NavDropdown title="Productos" id="basic-nav-dropdown">
              <NavDropdown.Item as={NavLink} to='/category/nuevos'>Nuevos</NavDropdown.Item>
                <NavDropdown.Divider />
              <NavDropdown.Item as={NavLink} to='/category/mas vendidos'>
               Mas vendidos
              </NavDropdown.Item>
                <NavDropdown.Divider />
              <NavDropdown.Item as={NavLink} to='/category/ofertas'>Ofertas</NavDropdown.Item>
            </NavDropdown>
          </Nav>
       <NavLink to='/cart'><CartWidgetRI /></NavLink>   
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarRB;