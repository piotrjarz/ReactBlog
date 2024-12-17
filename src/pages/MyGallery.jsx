import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';  // Importujemy Link do nawigacji

const MyGallery = () => {
  const [gallery, setGallery] = useState([]);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  // Pobranie danych o galeriach i postach z serwera
  useEffect(() => {
    const fetchGalleryAndPosts = async () => {
      try {
        // Pobieramy dane o obrazach z galerii
        const galleryResponse = await fetch('http://localhost:8000/gallery');
        const galleryData = await galleryResponse.json();

        const myGallery = galleryData.filter( (img) => Number(img.ImageAuthorId) === Number(user.id));


        setGallery(myGallery);

        // Pobieramy dane o postach
        const postsResponse = await fetch('http://localhost:8000/posts');
        const postsData = await postsResponse.json();
        setPosts(postsData);

      } catch (error) {
        setError('Wystąpił błąd podczas pobierania danych.');
        console.error(error);
      }
    };

    fetchGalleryAndPosts();
  }, []);

  return (
    <Container>
      

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="gx-4 gy-4 justify-content-center">
      <h3>Galeria</h3>
        {gallery.map((image) => {
          // Sprawdzamy, czy obrazek ma powiązanie z jakimkolwiek postem
          const postId = Number(image.ImagePostId); // Zakładając, że jest tylko jeden post powiązany z obrazkiem

          // Jeśli postId jest dostępne, wyszukujemy odpowiedni post
          const post = posts.find((p) => Number(p.id) === postId);

          return (
            <Col key={image.id} xs={12} sm={6} md={4} lg={3}>
              <Card className="h-100 shadow-sm w-100 my-card">
                <Card.Img
                  variant="top"
                  src={`${image.ImageURL}`}
                  alt={image.ImageName}
                  width={'300px'}
                  height={'300px'}
                />
                <Card.Body className='d-flex flex-column'>
                  <Card.Title>{image.ImageName}</Card.Title>
                  <Card.Text>{image.ImageDesc}</Card.Text>
                  {post && (
                    <Link to={`/posts/${post.id}`}>
                      <Button variant="primary">Zobacz post</Button>
                    </Link>
                  )}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default MyGallery;
