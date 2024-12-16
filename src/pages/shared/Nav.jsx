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
        <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
            <img src={logo} alt="Logo" style={{width: "60px", height: "60px"}}/>
        <Navbar.Brand href="/">Goju Blog</Navbar.Brand>
            <Row>
                
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="/">Strona główna</Nav.Link>
                    <Nav.Link href="/posts">Aktualności</Nav.Link>
                </Nav>
                {
                    (admin === 'true') ? (
                        <Nav className="me-auto">
                            <NavDropdown title="Wpisy" id="basic-nav-dropdown">
                                <NavDropdown.Item href="/posts/mine">
                                Twoje wpisy
                                </NavDropdown.Item>

                                <NavDropdown.Item href="/posts/add">
                                Dodaj wpis
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    ) : (<></>)
                }
                

                </Navbar.Collapse>
            </Row>

            <Row>
                <Nav>
                    <NavDropdown title="Twoje konto" id="basic-nav-dropdown">
                        {
                            user ? (
                                <>
                                
                                <NavDropdown.Item href="/profile">
                                Profil
                                </NavDropdown.Item>

                                <NavDropdown.Item href="/login" onClick={handleLougout}>
                                Wyloguj się
                                </NavDropdown.Item>
                                </>
                            ) : (
                            <>
                                <NavDropdown.Item href="/login">
                                Zaloguj się
                                </NavDropdown.Item>
                                <NavDropdown.Item href="/register">
                                Zarejestruj się
                                </NavDropdown.Item>
                            </>
                            )
                        }
                        
                    </NavDropdown>
                </Nav>
            </Row>
        </Container>
      </Navbar>
    )
}

export default WebNav;