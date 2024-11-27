import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Row } from "react-bootstrap";


const WebNav = () =>{
    return(
        <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
        <Navbar.Brand href="#home">Goju Blog</Navbar.Brand>
            <Row>
                
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="/">Strona główna</Nav.Link>
                    <Nav.Link href="/posts">Aktualności</Nav.Link>

                    <NavDropdown title="Galeria" id="basic-nav-dropdown">
                        <NavDropdown.Item href="/gallery">
                        Twoje zdjęcia
                        </NavDropdown.Item>

                        <NavDropdown.Item href="/gallery">
                        Wszystkie zdjęcia
                        </NavDropdown.Item>

                        <NavDropdown.Item href="#action/3.3">
                        Szukaj zdjęć
                        </NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                </Navbar.Collapse>
            </Row>

            <Row>
                <Nav>
                    <NavDropdown title="Twoje konto" id="basic-nav-dropdown">
                        <NavDropdown.Item href="/users/profile">
                        Profil
                        </NavDropdown.Item>

                        <NavDropdown.Item href="/users/settings">
                        Ustawienia
                        </NavDropdown.Item>

                        <NavDropdown.Item href="/logout">
                        Wyloguj się
                        </NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Row>
        </Container>
      </Navbar>
    )
}

export default WebNav;