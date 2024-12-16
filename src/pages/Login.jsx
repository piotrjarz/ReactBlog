import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useState } from "react";

const Login = () =>{

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8000/users");
            const users = await response.json();
            const user = users.find(
                (u) => u.UserName === username && u.UserPassword === password
        );

        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
            const admin = user.UserIsAdmin;
            console.log(`Admin ${admin}`)
            localStorage.setItem("admin", admin);
            if(localStorage.getItem("user")) {
                navigate("/home");
                window.location.reload();
            }
            else setError("Wystąpił błąd z logowaniem")
        } else {
            setError("Invalid username or password");
        }
        } catch (err) {
        setError("Error connecting to the server");
        }
    };

    return(
        <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={4}>
          <h3 className="text-center mb-4">Login</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nazwa użytkownika"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Hasło"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Zaloguj się
            </Button>
          </Form>
          <div className="text-center mt-3">
            <p>
              Nie masz konta? <Link to="/register">Zarejestruj się!</Link>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
    )
}

export default Login;