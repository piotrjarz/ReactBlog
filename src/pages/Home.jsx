import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";

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
          <Card className="text-white bg-primary mb-3">
            <Card.Body>
              <h1>Witaj na blogu Goju-Ryu!</h1>
              <p>
                Goju-Ryu to jeden z najbardziej tradycyjnych i cenionych
                stylów karate, który łączy w sobie twarde (Go) i miękkie (Ju)
                techniki. Jego korzenie sięgają Okinawy, a jego mistrzowie
                pozostawili trwały ślad w historii sztuk walki.
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
                Goju-Ryu zostało założone przez Chojuna Miyagi w latach 30. XX
                wieku. Styl ten łączy techniki twarde i miękkie, co czyni go
                wyjątkowym wśród innych tradycyjnych stylów karate. Jego nazwa
                dosłownie oznacza „twardą” (Go) i „miękką” (Ju) drogę, co
                odzwierciedla równowagę między brutalnością i elastycznością.
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
          <h3>Najnowsze wpisy na blogu</h3>
          <Row>
            {posts.slice(0, 3).map((post) => (
              <Col key={post.Id} md={4} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>{post.PostTitle}</Card.Title>
                    <Card.Text>
                      {post.PostContent.slice(0, 100)}... {/* Krótkie
                      streszczenie */}
                    </Card.Text>
                    <Button variant="primary" href={`/posts/${post.id}`}>
                      Zobacz więcej
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
