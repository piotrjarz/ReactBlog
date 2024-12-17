import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Row } from "react-bootstrap";
import {Image} from "react-bootstrap";
import logo from '../../logo.png'
import { useNavigate } from "react-router-dom";


const WebNav = () =>{

    const navigate = useNavigate();

    const user = localStorage.getItem("user");
    const admin = localStorage.getItem("admin");

    console.log(typeof(admin))

    const handleLougout = () =>{
        localStorage.removeItem("user");
        navigate("/login");
    }

    return(
        <Navbar expand="lg" className="bg-dark text-light">
  <Container>
    <img src={logo} alt="Logo" style={{ width: "60px", height: "60px" }} />
    <Navbar.Brand href="/">Goju Blog</Navbar.Brand>
    <Row>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/" className="text-light">Strona główna</Nav.Link>
          <Nav.Link href="/posts" className="text-light">Aktualności</Nav.Link>
        </Nav>
        {admin === 'true' && (
          <Nav className="me-auto">
            <NavDropdown title="Wpisy" id="basic-nav-dropdown" className="text-light">
              <NavDropdown.Item href="/posts/mine" className="text-dark">Twoje wpisy</NavDropdown.Item>
              <NavDropdown.Item href="/posts/add" className="text-dark">Dodaj wpis</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        )}
      </Navbar.Collapse>
    </Row>

    <Row>
      <Nav>
        <NavDropdown title="Twoje konto" id="basic-nav-dropdown-1" className="text-light" style={{color: 'white'}}>
          {user ? (
            <>
              <NavDropdown.Item href="/profile" className="text-dark">Profil</NavDropdown.Item>
              <NavDropdown.Item href="/login" onClick={handleLougout} className="text-light">Wyloguj się</NavDropdown.Item>
            </>
          ) : (
            <>
              <NavDropdown.Item href="/login" className="text-dar">Zaloguj się</NavDropdown.Item>
              <NavDropdown.Item href="/register" className="text-light">Zarejestruj się</NavDropdown.Item>
            </>
          )}
        </NavDropdown>
      </Nav>
    </Row>
  </Container>
</Navbar>

    )
}

export default WebNav;