import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";

const Post = () => {
  let param = useParams();

  // Ustawianie stanu
  const [posts, setPosts] = useState([]);

  // Funkcja pobierająca posty i dopasowująca użytkowników
  const fetchPosts = useCallback(async () => {
    const postsResp = await fetch("http://localhost:8000/posts");
    const postsData = await postsResp.json();

    // Pobieranie użytkowników
    const usersResp = await fetch("http://localhost:8000/users");
    const usersData = await usersResp.json();

    // Mapowanie postów z użytkownikami
    const postsWithUsers = postsData.map((post) => ({
      ...post,
      user: usersData.find((user) => user.Id === post.PostUserId), // Dopasowanie użytkownika
      likes: usersData.filter((user) => post.PostLikes.includes(user.Id))
    }));

    setPosts(postsWithUsers);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <Container>
      <Row>
        {posts.slice().reverse().map((post) => (
          <Card style={{ width: "18rem" }} key={post.Id} className="m-3">
            <Card.Body>
              <Card.Title>{post.PostTitle}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                Autor: {post.user ? post.user.UserName : "Nieznany"} {/* Obsługa braku danych */}
              </Card.Subtitle>
              <Card.Text>{post.PostContent}</Card.Text>
              <Button variant="primary" onClick={() => alert(`Post ID: ${post.Id}`)}>
                Przejdź do artykułu
              </Button>
              <Button variant="success" onClick={()=>{
                alert(`Polubienia: \n${post.likes.map((user) => user.UserName).join("\n")}`);
              }}>
                Polubienia
              </Button>
            </Card.Body>
          </Card>
        ))}
      </Row>
    </Container>
  );
};

export default Post;
