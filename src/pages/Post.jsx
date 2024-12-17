import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import { Modal, Col } from "react-bootstrap";

// CSS
import "../card_style.css" // Card
import "../button_style.css" // Buttons


const Post = () => {
  let param = useParams();

  const user = JSON.parse(localStorage.getItem("user")).id;
  const admin = localStorage.getItem("admin");
  // Ustawianie stanu
  const [posts, setPosts] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);


  const [likedUsers, setLikedUsers] = useState([]);
  const [postsData, setPostsData] = useState(posts);

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
      user: usersData.find((user) => Number(user.id) === Number(post.PostUserId)), // Dopasowanie użytkownika
      likes: usersData.filter((user) => post.PostLikes.includes(Number(user.id)))
    }));

    setPosts(postsWithUsers);
  }, []);



  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleShowLikes = (likes) => {
    setLikedUsers(likes.map(user => user.UserName)); // Zbieramy nazwy użytkowników, którzy polubili
    setShowModal(true); // Pokazujemy modal
  };

  const handleCloseModal = () => setShowModal(false);

  const handleDeletePost = async () => {
    if(postToDelete){
      const resp = await fetch(`http://localhost:8000/posts/${postToDelete}`, {
        method: "DELETE"
      })
      if(resp.ok){
        setPosts(prevPosts => prevPosts.filter(post => Number(post.id) !== Number(postToDelete)))
      }
      else{
        throw new Error(`Coś poszło nie tak! ${resp.status}`)
      }
      handleCloseDeleteModal()
    }

  }

  const handleShowDeleteModal = (postId) => {
    setPostToDelete(postId); // Ustawiamy post do usunięcia
    setShowDeleteModal(true); // Pokazujemy modal
  };

  const handleCloseDeleteModal = () =>{
    setShowDeleteModal(false);
    setPostToDelete(null);

  }

  return (
    <Container className="my-5">
  {/* Wyśrodkowanie zawartości */}
  <Row className="gx-4 gy-4 justify-content-center">
    {posts.slice().reverse().map((post) => (
      <Col
      key={post.Id}
      md={4} /* 3 kolumny w jednym rzędzie na średnich i większych ekranach */
      sm={6} /* 2 kolumny na mniejszych ekranach */
      xs={12} /* 1 kolumna na małych ekranach */
      className="d-flex align-items-stretch"
    >
        <Card className="h-100 shadow-sm w-100 my-card">
          <Card.Body className="d-flex flex-column">
            <Card.Title className="text-center mb-3" style={{ fontWeight: "600" }}>
              {post.PostTitle}
            </Card.Title>
            <Card.Subtitle className="mb-2 text-muted text-center">
              Autor: {post.user ? post.user.UserName : "Nieznany"}
            </Card.Subtitle>
            <Card.Text
              className="text-muted"
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
            <div className="mt-auto d-flex justify-content-between">
              <Button
                variant="primary"
                size="m" /* Zastosowanie mniejszego rozmiaru */
                href={`/posts/${post.id}`}
                className="btn-custom mt-auto"
              >
                Przejdź do artykułu
              </Button>
              <Button
                variant="success"
                size="m" /* Zastosowanie mniejszego rozmiaru */
                onClick={() => handleShowLikes(post.likes)}
                className="btn-custom btn-custom-success mt-auto"
              >
                Polubienia
              </Button>
            </div>

            {admin === "true" && (
              <>
              <div className="d-flex justify-content-between mt-2">
                <Button
                  variant="danger"
                  size="m" 
                  onClick={() => handleShowDeleteModal(post.id)}
                  className="btn-custom btn-custom-danger mt-auto"
                >
                  Usuń post
                </Button>
                <Button
                  variant="warning"
                  size="m" /* Zastosowanie mniejszego rozmiaru */
                  href={`/posts/edit/${post.id}`}
                  className="btn-custom btn-custom-warning mt-auto"
                >
                  Edytuj Post
                </Button>
              </div>
              </>
            )}
          </Card.Body>
        </Card>
      </Col>
    ))}
  </Row>

  {/* Modal wyświetlający użytkowników, którzy polubili post */}
  <Modal show={showModal} onHide={handleCloseModal}>
    <Modal.Header closeButton>
      <Modal.Title>Polubienia</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <ul>
        {likedUsers.length === 0 ? (
          <li>Brak polubień</li>
        ) : (
          likedUsers.map((username, index) => <li key={index}>{username}</li>)
        )}
      </ul>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleCloseModal}>
        Zamknij
      </Button>
    </Modal.Footer>
  </Modal>

  {/* Modal potwierdzenia usunięcia */}
  <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
    <Modal.Header closeButton>
      <Modal.Title>Potwierdzenie usunięcia</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      Czy na pewno chcesz usunąć ten post? Ta operacja jest nieodwracalna.
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleCloseDeleteModal}>
        Anuluj
      </Button>
      <Button variant="danger" onClick={handleDeletePost}>
        Usuń
      </Button>
    </Modal.Footer>
  </Modal>
</Container>


    
  );
};

export default Post;
