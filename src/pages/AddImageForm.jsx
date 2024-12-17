import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const AddImageForm = () => {
    const [imageName, setImageName] = useState('');
    const [imageDesc, setImageDesc] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imageURL, setImageURL] = useState('');
    const [selectedPostId, setSelectedPostId] = useState('');
    const [posts, setPosts] = useState([]); // Lista postów
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));
  

    useEffect(() => {
        const fetchPosts = async () => {
          try {
            const response = await fetch('http://localhost:8000/posts');
            const data = await response.json();
            setPosts(data); // Przechowujemy posty
          } catch (error) {
            setError('Wystąpił błąd podczas pobierania postów.');
            console.error(error);
          }
        };
    
        fetchPosts();
      }, []);

  // Obsługuje zmianę pliku obrazu
  const handleImageChange = (url) => {
      setImageURL(url);
    }

  // Funkcja do obsługi formularza
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageName || !imageDesc || !imageURL) {
      setError("Wszystkie pola muszą być wypełnione.");
      return;
    }
    

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const galleryResp = await fetch(`http://localhost:8000/gallery`);
    const galleryData = await galleryResp.json();

    const galleryLastId = galleryData[galleryData.length-1].id;


    try {
      const response = await fetch('http://localhost:8000/gallery', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify({
            id: String(Number(galleryLastId)+1),
            ImageName: imageName,
            ImageDesc: imageDesc,
            ImageURL: imageURL,
            ImageAuthorId: user.id,
            ImagePostId: JSON.stringify([selectedPostId])
        })
      });

      if (response.ok) {
        setSuccess('Obrazek został pomyślnie dodany!');
        setImageName('');
        setImageDesc('');
        setImageFile(null);
        setImageURL('');
      } else {
        setError('Wystąpił błąd podczas dodawania obrazka.');
      }
    } catch (error) {
      setError('Wystąpił błąd podczas wysyłania obrazka.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Container>
      <h3>Dodaj nowy obrazek</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="imageName">
          <Form.Label>Nazwa obrazu</Form.Label>
          <Form.Control
            type="text"
            placeholder="Wprowadź nazwę obrazu"
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="imageDesc">
          <Form.Label>Opis obrazu</Form.Label>
          <Form.Control
            type="text"
            placeholder="Wprowadź opis obrazu"
            value={imageDesc}
            onChange={(e) => setImageDesc(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="postSelect">
          <Form.Label>Wybierz post</Form.Label>
          <Form.Select
            value={selectedPostId}
            onChange={(e) => setSelectedPostId(e.target.value)}
            required
          >
            <option value="">Wybierz post</option>
            {posts.map((post) => (
              <option key={post.id} value={post.id}>
                {post.PostTitle}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="imageFile">
          <Form.Label>Wpisz URL obrazku</Form.Label>
          <Form.Control
            type="text"
            onChange={(e)=> handleImageChange(e.target.value)}
            required
          />
          {imageURL && (
            <div className="mt-3">
              <img src={imageURL} alt="Podgląd" width="100" height="100" />
            </div>
          )}
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className="mt-3"
        >
            Dodaj obrazek
        </Button>
      </Form>
    </Container>
  );
}
export default AddImageForm;
