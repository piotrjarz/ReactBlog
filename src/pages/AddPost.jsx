import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

const AddPost = () => {
  // Stan dla formularza
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Pobranie ID użytkownika (zalogowanego) z localStorage
  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Walidacja formularza
    if (!postTitle || !postContent || !userId) {
      setError("Wszystkie pola muszą być wypełnione.");
      return;
    }

    try {

      const post = await fetch(`http://localhost:8000/posts`);
      const postData = await post.json()

      const newPost = {
        PostTitle: postTitle,
        PostContent: postContent,
        PostUserId: userId,  // ID zalogowanego użytkownika
        PostLikes: [],  // Możesz dodać mechanizm polubień w przyszłości
        id: String(Number(postData[postData.length-1].id) + 1),  // Unikalny identyfikator na podstawie czasu
      };

      // Wysłanie danych do JSON Server (lub innego backendu)
      const response = await fetch("http://localhost:8000/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      });

      if (response.ok) {
        setSuccess(true);
        setError(null);
        setPostTitle("");
        setPostContent("");
      } else {
        setError("Wystąpił błąd podczas dodawania wpisu.");
      }
    } catch (error) {
      setError("Wystąpił błąd. Spróbuj ponownie.");
    }
  };

  return (
    <div>
      <h3>Dodaj nowy wpis</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Wpis został dodany!</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="postTitle">
          <Form.Label>Tytuł wpisu</Form.Label>
          <Form.Control
            type="text"
            placeholder="Wprowadź tytuł wpisu"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="postContent">
          <Form.Label>Treść wpisu</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="Wprowadź treść wpisu"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Dodaj wpis
        </Button>
      </Form>
    </div>
  );
};

export default AddPost;
