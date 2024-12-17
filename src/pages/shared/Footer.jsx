import React from "react";
import { Container, Row, Col } from "react-bootstrap";

// CSS
import "../../footer.css"

const Footer = () =>{
    return(
        <footer className="bg-dark text-light py-3">
        <Container>
          <Row className="align-items-center">
            <Col md={4} className="text-center text-md-start mb-2 mb-md-0">
              <h5 className="mb-0">Goju Blog</h5>
              <small>&copy; {new Date().getFullYear()} Wszystkie prawa zastrzeżone.</small>
            </Col>
    
            <Col md={4} className="text-center mb-2 mb-md-0">
              <ul className="list-unstyled d-flex justify-content-center mb-0">
                <li className="mx-3">
                  <a href="/" className="text-light text-decoration-none">O nas</a>
                </li>
                <li className="mx-3">
                  <a href="/posts" className="text-light text-decoration-none">Aktualności</a>
                </li>
              </ul>
            </Col>
    
            <Col md={4} className="text-center text-md-end">
              <a href="https://facebook.com" className="text-light mx-2">
                <i className="fab fa-facebook fa-lg"></i>
              </a>
              <a href="https://twitter.com" className="text-light mx-2">
                <i className="fab fa-twitter fa-lg"></i>
              </a>
              <a href="https://instagram.com" className="text-light mx-2">
                <i className="fab fa-instagram fa-lg"></i>
              </a>
            </Col>
          </Row>
        </Container>
      </footer>
    )
}

export default Footer;