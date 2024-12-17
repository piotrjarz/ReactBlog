import React, { useCallback, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";

const MyPosts = () =>{
    const [posts, setPosts] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user.id;

    const fetchPosts = useCallback(async () => {
        const postsResp = await fetch(`http://localhost:8000/posts/?PostUserId=${userId}`);
        const postsData = await postsResp.json()
        // const userPosts = postsData.filter( (post) =>(
        //     post.PostUserId === userId
        // ))

        setPosts(postsData);
    }, []);

    useEffect( () => {
        fetchPosts();
    }, [fetchPosts]);

    return(
        <Container>
      <Row>
        {posts.slice().reverse().map((post) => (
          <Card style={{ width: "18rem" }} key={post.Id} className="m-3">
            <Card.Body>
              <Card.Title>{post.PostTitle}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                Autor: {user.UserName ? user.UserName : "Nieznany"} {/* Obsługa braku danych */}
              </Card.Subtitle>
              <Card.Text>{post.PostContent}</Card.Text>
              <Button variant="primary" href={`/posts/${post.Id}`}>
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
    )
}

export default MyPosts;