import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Form, Row, Col, Alert, Card, ListGroup, Button } from "react-bootstrap";

const PostDetails = () => {
  const { id } = useParams(); // Pobierz id z URL
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const [users, setUsers] = useState([]);
  const [lastCommentId, setLastCommentId] = useState(0);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        // Pobierz post
        const postResponse = await fetch(`http://localhost:8000/posts/?Id=${id}`);
        if (!postResponse.ok) throw new Error("Nie znaleziono takiego wpisu.");
        const postData = await postResponse.json();

        // Pobierz komentarze powiązane z postem
        const commentsResponse = await fetch(
        `http://localhost:8000/comments?CommentPostId=${id}`
        );
        const commentsData = await commentsResponse.json();
        //console.log(commentsData);

        const commentsIdResponse = await fetch(
            `http://localhost:8000/comments`
        );
        const commentsIdData = await commentsIdResponse.json();
        setLastCommentId(commentsIdData[commentsIdData.length-1].Id);

        const usersResp = await fetch (
            `http://localhost:8000/users`
        );

        const usersData = await usersResp.json();

        const userIds = [...new Set(commentsData.map((comment) => comment.CommentUserId))];

        //console.log(usersData)
        const userComments = usersData.filter( (user) => userIds.includes(user.Id));

        //console.log(userComments);
        

        

        setPost(postData);
        setComments(commentsData);
        
        setUsers(userComments);
        console.log((userComments))
        //console.log((users))
        
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
        Id: lastCommentId + 1, // Tymczasowy unikalny ID, można zastąpić automatycznym generowaniem na serwerze
        CommentUserId: user.Id,
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

      const addedComment = await response.json();
      setComments([...comments, addedComment]); // Aktualizuj lokalną listę komentarzy
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

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>{post[0].PostTitle}</Card.Title>
              <Card.Text>{post[0].PostContent}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <h4>Komentarze</h4>
          {comments.length > 0 ? (
            <ListGroup>
              {comments.map((comment) => (
                <ListGroup.Item key={comment.Id}>
                    <Row>
                    <strong>
                    {users.find( (user) => user.Id === comment.CommentUserId)?.UserName || "Nieznany"}
                  </strong>
                  {comment.CommentContent}
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
              You must be logged in to add a comment.
            </Alert>
          </Col>
        </Row>
      )}


    </Container>
  );
};

export default PostDetails;
