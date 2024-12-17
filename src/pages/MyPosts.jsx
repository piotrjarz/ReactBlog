import React, { useCallback, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import { Col, Modal } from "react-bootstrap";

// CSS
import "../button_style.css"
import "../card_style.css"

const MyPosts = () =>{
    const [posts, setPosts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));
    const [likedUsers, setLikedUsers] = useState([]);
    const userId = user.id;

    const fetchPosts = useCallback(async () => {
        const postsResp = await fetch(`http://localhost:8000/posts/?PostUserId=${userId}`);
        const postsData = await postsResp.json()
        // const userPosts = postsData.filter( (post) =>(
        //     post.PostUserId === userId
        // ))

        const usersResp = await fetch("http://localhost:8000/users");
        const usersData = await usersResp.json();

        const postsWithUsers = postsData.map((post) => ({
          ...post,
          user: usersData.find((user) => Number(user.id) === Number(post.PostUserId)), // Dopasowanie użytkownika
          likes: usersData.filter((user) => post.PostLikes.includes(Number(user.id)))
        }));
    
        setPosts(postsWithUsers);
    }, []);

    useEffect( () => {
        fetchPosts();
    }, [fetchPosts]);

    
    const handleCloseModal = () => setShowModal(false);

    const handleShowLikes = (likes) => {
      setLikedUsers(likes.map(user => user.UserName)); // Zbieramy nazwy użytkowników, którzy polubili
      console.log(likedUsers)
      setShowModal(true); // Pokazujemy modal
    };

    return(
      <Container className="my-5">
  <Row className="gx-4 gy-4">
    {posts.slice().reverse().map((post) => (
      <Col
        key={post.Id}
        md={4} /* 3 kolumny w jednym rzędzie na średnich i większych ekranach */
        sm={6} /* 2 kolumny na mniejszych ekranach */
        xs={12} /* 1 kolumna na małych ekranach */
        className="d-flex align-items-stretch"
      >
        <Card className="h-100 shadow-sm w-100">
          <Card.Body className="d-flex flex-column">
            {/* Tytuł posta */}
            <Card.Title className="mb-3" style={{ fontWeight: "600" }}>
              {post.PostTitle}
            </Card.Title>

            {/* Autor posta */}
            <Card.Subtitle className="mb-2 text-muted">
              Autor: {post.user && post.user.UserName ? post.user.UserName : "Nieznany"}
            </Card.Subtitle>

            {/* Treść posta */}
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

            {/* Przyciski */}
            <div className="mt-auto d-flex justify-content-between">
              <Button
                variant="primary"
                href={`/posts/${post.id}`}
                size="m"
                className=""
              >
                Przejdź do artykułu
              </Button>
              <Button
                variant="success"
                size="m"
                onClick={() => handleShowLikes(post.likes)}
                className=""
              >
                Polubienia
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    ))}
  </Row>

  {/* Modal do wyświetlania polubień */}
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
</Container>

    
    )
}

export default MyPosts;