import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";


// CSS
import "../button_style.css" // Buttons

const Home = () => {
  const [posts, setPosts] = useState([]);

  // Pobranie najnowszych postów z backendu
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("http://localhost:8000/posts");
      const data = await response.json();
      setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <Container fluid="md">
      {/* Sekcja ogólnych informacji o Goju-Ryu */}
      <Row className="my-5">
        <Col>
          <Card className="mb-3">
            <Card.Body>
              <h1>Witaj na blogu o Goju-Ryu!</h1>
              <p>
                Karate Goju-Ryu wywodzi się z Okinawy. Został opracowany przez jej mieszkańców - Kanryo Higaonna (1853 - 1916) - styl Naha-te oraz Chojun Miyagi (1888 - 1953) - styl Goju Ryu.
                Jest on połączeniem tradycyjnego Okinawskiego <i>Okinawa te</i> ze stylami białego żurawia i tygrysa.
                Okinawa te podzielono na trzy główne style, nazwane po miastach na Okinawie:
                <ul>
                  <li>Naha-Te - miękkie techniki, kontrola oddechu, spięcie na końcu. Zawiera w sobie techniki miękkie, takie jak rzuty, chwyty i bloki</li>
                  <li>Shuri-Te - twardy styl, nastawiony na atak</li>
                  <li>Tomari-Te - połączenie technik miękkich i twardych z Kempo</li>
                </ul>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Sekcja o historii Goju-Ryu */}
      <Row className="my-5">
        <Col sm={12} md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Historia Goju-Ryu</Card.Title>
              <Card.Text>
                Goju-Ryu oficjalnie zostało utworzone w 1933 przez Chojun'a Miyagiego, kiedy to zostało wpisane w Butokukai, czyli japońskim centrum sztuk walki.
                Chojun Miyagi wprowadził w 1940 roku podstawowe kata - Gekisai dai Ichi (uderzyć i zniszczyć 1) oraz Gekisai dai Ni (uderzyć i zniszczyć 2). Poza tym opracował kata Tensho (obracające się dłonie) oraz skrócił kata Sanchin (trzy bitwy).
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Sekcja o mistrzach i federacjach */}
        <Col sm={12} md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Mistrzowie i Federacje</Card.Title>
              <Card.Text>
                W Goju-Ryu wychowało się wielu wybitnych mistrzów, którzy
                przyczynili się do rozwoju tego stylu na całym świecie. Niektóre
                z najważniejszych federacji Goju-Ryu to:
                <ul>
                  <li>International Okinawan Goju-Ryu Karate-do Federation (IOGKF) - Tetsuji Nakamura sensei</li>
                  <li>Traditional Okinawan Goju-Ryu Karate-do Federation (TOGKF) - Higaonna Morio sensei</li>
                  <li>Meibukan Goju-ryu - Meitatsu Yagi sensei</li>
                  <li>Okinawa Goju-ryu Karatedo Kyokai (OGKK)</li>
                </ul>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Sekcja z najnowszymi postami */}
      <Row className="my-5">
  <Col>
    <h3 className="text-center mb-4">Najnowsze wpisy na blogu</h3>
    <Row className="gx-4 gy-4"> {/* Dodanie odstępów między kolumnami */}
      {posts.slice().reverse().slice(0,3).map((post) => (
        <Col key={post.Id} md={4} sm={6} xs={12} className="d-flex align-items-stretch">
          <Card className="h-100 w-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
              <Card.Title className="mb-3" style={{ fontWeight: "600" }}>
                {post.PostTitle}
              </Card.Title>
              <Card.Text
                className="flex-grow-1"
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {post.PostContent}
              </Card.Text>
              <Button
                variant="primary"
                href={`/posts/${post.id}`}
                className="btn-custom mt-auto"
              >
                Przejdź do wpisu
              </Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  </Col>
</Row>


    </Container>
  );
};

export default Home;
