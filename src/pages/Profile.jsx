import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";

// Funkcja do renderowania strony profilu
const Profile = () => {
  const [oldPassword, setOldPassword] = useState(""); // Stare hasło
  const [newPassword, setNewPassword] = useState(""); // Nowe hasło
  const [confirmNewPassword, setConfirmNewPassword] = useState(""); // Potwierdzenie nowego hasła
  const [error, setError] = useState(""); // Błąd walidacji
  const [success, setSuccess] = useState(""); // Sukces zmiany hasła


  const user = JSON.parse(localStorage.getItem("user"));

  // Funkcja do zmiany hasła
  const handlePasswordChange = async () => {
    setError(""); // Resetowanie błędu
    setSuccess(""); // Resetowanie sukcesu

    // Walidacja formularza
    if (newPassword !== confirmNewPassword) {
      setError("Nowe hasło i potwierdzenie hasła muszą być identyczne.");
      return;
    }

    // Prosta walidacja długości hasła
    if (newPassword.length < 6) {
      setError("Nowe hasło musi mieć co najmniej 6 znaków.");
      return;
    }

    try {
      // Wysłanie żądania zmiany hasła na serwer
      const response = await fetch(`http://localhost:8000/users/${user.Id}`, {
        method: "PUT", // lub PATCH, jeśli chcesz częściowo zaktualizować użytkownika
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UserEmail: user.UserEmail, // Możemy przechować email w stanie lub w localStorage
          UserName: user.UserName, // Możemy przechować username w stanie
          UserPassword: newPassword, // Stare hasło
        }),
      });

      if (response.ok) {
        setSuccess("Hasło zostało zmienione pomyślnie.");
        // W zależności od backendu, możemy chcieć ponownie zalogować użytkownika
        // lub wylogować, jeśli hasło się zmieniło.
      } else {
        setError("Nie udało się zmienić hasła. Sprawdź dane.");
      }
    } catch (err) {
      setError("Wystąpił błąd podczas zmiany hasła.");
    }
  };

  return (
    <Container className="my-5">
      {/* Wyświetlanie danych użytkownika */}
      <Row className="mb-5">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Profil użytkownika</Card.Title>
              <Card.Text>
                <strong>Nazwa użytkownika:</strong> {user.UserName}
              </Card.Text>
              <Card.Text>
                <strong>Email:</strong> {user.UserEmail}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Formularz zmiany hasła */}
      <Row>
        <Col>
          <h3>Zmień hasło</h3>

          {/* Jeśli wystąpił błąd, wyświetlamy komunikat */}
          {error && <Alert variant="danger">{error}</Alert>}

          {/* Jeśli zmiana hasła się udała, wyświetlamy sukces */}
          {success && <Alert variant="success">{success}</Alert>}

          <Card>
            <Card.Body>
              <Form>
                <Form.Group controlId="formOldPassword">
                  <Form.Label>Stare hasło</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Wpisz stare hasło"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formNewPassword">
                  <Form.Label>Nowe hasło</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Wpisz nowe hasło"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formConfirmNewPassword">
                  <Form.Label>Potwierdź nowe hasło</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Potwierdź nowe hasło"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                  />
                </Form.Group>

                <Button variant="primary" onClick={handlePasswordChange}>
                  Zmień hasło
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
