import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Form, Row, Col, Alert, Card, ListGroup, Button, Modal } from "react-bootstrap";
//import like from "../like.png"
import like from "../like.svg"

// CSS
import "../img_hover.css"
import "../a_custom.css"

const PostDetails = () => {
  const { id } = useParams(); // Pobierz id z URL
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [lastCommentId, setLastCommentId] = useState(0);
  
  const user = JSON.parse(localStorage.getItem("user"));
  const admin = localStorage.getItem("admin");

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [commentToDelete, setCommentToDelete] = useState(null)

  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        // Pobierz post
        const postResponse = await fetch(`http://localhost:8000/posts/${id}`);
        if (!postResponse.ok) throw new Error("Nie znaleziono takiego wpisu.");
        const postData = await postResponse.json();

        // Pobierz komentarze powiązane z postem
        const commentsResponse = await fetch(
        `http://localhost:8000/comments?CommentPostId=${id}`
        );
        const commentsData = await commentsResponse.json();

        const commentsIdResponse = await fetch(
            `http://localhost:8000/comments`
        );
        const commentsIdData = await commentsIdResponse.json();
        setLastCommentId(commentsIdData[commentsIdData.length-1].id);

        const usersResp = await fetch (
            `http://localhost:8000/users`
        );

        const usersData = await usersResp.json();


        const userIds = [...new Set(commentsData.map((comment) => Number(comment.CommentUserId)))];

        const userComments = usersData.filter( (user) => userIds.includes(Number(user.id)));

        setLikesCount(postData.PostLikes.length);

        setPost(postData);
        setComments(commentsData);
        
        setUsers(userComments);
        
        } catch (err) {
        setError(err.message);
        }
    };

    fetchPostDetails();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!newComment) {
      setError("Komentarz nie może być pusty.");
      return;
    }

    try {
      const commentToAdd = {
        id: String(Number(lastCommentId) + 1), // Tymczasowy unikalny ID, można zastąpić automatycznym generowaniem na serwerze
        CommentUserId: user.id,
        CommentPostId: parseInt(id),
        CommentContent: newComment,
      };

      const response = await fetch("http://localhost:8000/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentToAdd),
      });

      if (!response.ok) {
        throw new Error("Nie udało się dodać komentarza");
      }

      setComments((prevComments) => [...prevComments, commentToAdd]); // Aktualizuj lokalną listę komentarzy
      setNewComment(""); // Resetuj pole formularza
      setSuccess("Dodano komentarz pomyślnie!");
    } catch (err) {
      setError(err.message || "Nie udało się dodać komentarza.");
    }
  };


  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">Błąd: {error}</Alert>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container className="mt-5">
        <Alert variant="info">Ładowanie wpisu...</Alert>
      </Container>
    );
  }

  const handleLikePost = async () =>{
    if(post){
        const postLikes = post.PostLikes.includes(Number(user.id))
      ? post.PostLikes.filter((id) => id !== Number(user.id)) // Usuwamy polubienie
      : [...post.PostLikes, Number(user.id)]; // Dodajemy polubienie
      
        
        const resp = await fetch(`http://localhost:8000/posts/${post.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body : JSON.stringify({
            PostLikes: postLikes
          })
        })
        
        setPost((prevPost) => ({
          ...prevPost,
          PostLikes: postLikes, // Zaktualizowany stan polubień
        }));
        setLikesCount(postLikes.length);
      }
  }

  const handleShowDeleteModal = (commentId) => {
    setCommentToDelete(commentId);
    setShowDeleteModal(true);
  }

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setCommentToDelete(null); // Czyszczymy postToDelete
  };

  const handleDeleteComment = async () => {
    if(commentToDelete){
      const resp = await fetch(`http://localhost:8000/comments/${commentToDelete}`, {
        method: "DELETE"
      })
      if(resp.ok){
        setComments(prevComments => prevComments.filter(comment => Number(comment.id) !== Number(commentToDelete)))
      }
      else{
        throw new Error(`Coś poszło nie tak! ${resp.status}`)
      }
      handleCloseDeleteModal()
    }

  }

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>{post.PostTitle}</Card.Title>
              <Card.Text>{post.PostContent}</Card.Text>
            </Card.Body>
            <Card.Footer>
              <Card.Text>Podoba ci się ten wpis? Polub go!</Card.Text>
              <p><strong>Polubienia: </strong>{likesCount}</p>
            <img src={like} alt="like"  style={{width: "30px", height: "30px"}} onClick={handleLikePost}/>
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <h4>Komentarze</h4>
          {comments.length > 0 ? (
            <ListGroup>
              {comments.map((comment) => (
                <ListGroup.Item key={comment.id}>
                    <Row>
                    <Col>
                      <strong>
                        {users.find((user) => Number(user.id) === Number(comment.CommentUserId))?.UserName || "Nieznany"}
                      </strong>
                      <div>{comment.CommentContent}</div>
                    </Col>
                    <Col>
                      <div className="d-flex flex-column align-items-end">
                        {((admin === 'true') || (Number(comment.CommentUserId) === Number(user.id))) && (
                          <a className="a-custom-danger" onClick={() => handleShowDeleteModal(comment.id)} style={{ width: 'auto', marginTop: '10px' }}>
                            Usuń komentarz
                          </a>
                        )}
                      </div>
                    </Col>
                  </Row>

                  
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <Alert variant="info">Pusto coś tutaj... Dodaj komentarz jako pierwszy!</Alert>
          )}
        </Col>
      </Row>
      {user ? (
        <Row className="mt-4">
          <Col>
            <h5>Dodawanie komentarza</h5>
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleAddComment}>
              <Form.Group controlId="newComment" className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Treść komentarza"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Skomentuj wpis
              </Button>
            </Form>
          </Col>
        </Row>
      ) : (
        <Row className="mt-4">
          <Col>
            <Alert variant="warning">
              Musisz być zalogowany, aby skomentować.
            </Alert>
          </Col>
        </Row>
      )}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Potwierdzenie usunięcia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Czy na pewno chcesz usunąć ten komentarz? Ta operacja jest nieodwracalna.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Anuluj
          </Button>
          <Button variant="danger" onClick={handleDeleteComment}>
            Usuń
          </Button>
        </Modal.Footer>
      </Modal>


    </Container>
  );
};

export default PostDetails;
