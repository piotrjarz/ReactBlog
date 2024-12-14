import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/users");
      const users = await response.json();
      const userExists = users.find((u) => u.UserName === username || u.UserEmail === email);

      if(!emailRegex.test(email)){
        setError("Wprowadzono nieprawidłowy adres e-mail!");
        return;
      }

      if (userExists) {
        setError("Taki użytkownik istnieje już w bazie!");
        return;
      }

      const newUser = { username, password };
      await fetch("http://localhost:8000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Po 2 sekundach przekierowujemy na stronę logowania
    } catch (err) {
      setError("Nie udało się połączyć z serwerem");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={4}>
          <h3 className="text-center mb-4">Register</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && (
            <Alert variant="success">Pomyślnie zarejestrowano! Przekierowywanie...</Alert>
          )}
          <Form onSubmit={handleRegister}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Nazwa użytkownika</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nazwa użytkownika"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>E-mail</Form.Label>
              <Form.Control
                type="text"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Hasło</Form.Label>
              <Form.Control
                type="password"
                placeholder="Hasło"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Powtórz hasło</Form.Label>
              <Form.Control
                type="password"
                placeholder="Powtórz hasło"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Zarejestruj
            </Button>
          </Form>
          <div className="text-center mt-3">
            <p>
              Masz już konto? <Link to="/login">Zaloguj się!</Link>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
