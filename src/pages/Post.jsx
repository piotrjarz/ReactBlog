import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import { Modal } from "react-bootstrap";


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
    console.log(likedUsers)
    setShowModal(true); // Pokazujemy modal
  };

  const handleCloseModal = () => setShowModal(false);

  const handleDeletePost = async () => {
    if(postToDelete){
      const resp = await fetch(`http://localhost:8000/posts/${postToDelete}`, {
        method: "DELETE"
      })
      if(resp.ok){
        console.log(`Usunięto post o id = ${postToDelete}`);
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

              <Button variant="primary" href={`/posts/${post.id}`}>
                Przejdź do artykułu
              </Button>

              {/* Wyświetlanie przycisku do polubień, otwierającego modal */}
              <Button variant="success" onClick={() => handleShowLikes(post.likes)}>
                Polubienia
              </Button>

              {(admin === 'true') ? (

                <Button variant="danger" onClick={() => handleShowDeleteModal(post.id)}>
                  Usuń post
                </Button>
              ) : (
                  <></>
              )}
              
              
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
