import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import { Modal } from "react-bootstrap";

const Post = () => {
  let param = useParams();

  // Ustawianie stanu
  const [posts, setPosts] = useState([]);

  const [showModal, setShowModal] = useState(false);
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
      user: usersData.find((user) => user.Id === post.PostUserId), // Dopasowanie użytkownika
      likes: usersData.filter((user) => post.PostLikes.includes(user.Id))
    }));

    setPosts(postsWithUsers);
  }, []);

  const handleLikePost = async (postId) => {
    // Sprawdzenie, czy użytkownik już polubił ten post
    const userId = JSON.parse(localStorage.getItem("user"))?.Id; // Pobranie id użytkownika z localStorage

    if (!userId) {
      alert("Musisz być zalogowany, aby polubić post!");
      return;
    }

    // Zaktualizowanie listy polubień
    const updatedPosts = postsData.map(post => {
      if (post.Id === postId) {
        // Sprawdzenie, czy użytkownik już polubił ten post
        if (post.PostLikes.some(like => like.UserId === userId)) {
          post.PostLikes = post.PostLikes.filter(like => like.UserId !== userId); // Usuwanie polubienia
        } else {
          post.PostLikes.push({ UserId: userId, UserName: JSON.parse(localStorage.getItem("user")).UserName }); // Dodawanie polubienia
        }
      }
      return post;
    });

    // Zaktualizowanie stanu i bazy danych (jeśli masz API, możesz zaktualizować backend)
    setPostsData(updatedPosts);

    //Opcjonalnie, możesz też zaktualizować dane na backendzie, np. za pomocą fetch
    await fetch(`http://localhost:8000/posts/?Id=${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ PostLikes: likedUsers })
    });
  };


  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleShowLikes = (likes) => {
    setLikedUsers(likes.map(user => user.UserName)); // Zbieramy nazwy użytkowników, którzy polubili
    console.log(likedUsers)
    setShowModal(true); // Pokazujemy modal
  };

  const handleCloseModal = () => setShowModal(false);

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

              {/* Zastosowanie overflow, aby treść posta nie wychodziła poza kartę */}
              <Card.Text style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {post.PostContent}
              </Card.Text>

              <Button variant="primary" href={`/posts/${post.Id}`}>
                Przejdź do artykułu
              </Button>

              {/* Wyświetlanie przycisku do polubień, otwierającego modal */}
              <Button variant="success" onClick={() => handleShowLikes(post.likes)}>
                Polubienia
              </Button>
            </Card.Body>
          </Card>
        ))}
      </Row>

      {/* Modal wyświetlający użytkowników, którzy polubili post */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Polubienia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Wyświetlamy listę użytkowników, którzy polubili post */}
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
  );
};

export default Post;
