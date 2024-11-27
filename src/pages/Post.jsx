import React from "react";
import { useParams } from "react-router-dom";
import {useState, useCallback, useEffect} from "react"

//Import bootstrapa
import Container from "react-bootstrap/Container"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import Row from "react-bootstrap/Row"

const Post = () =>{
    let param = useParams();

    // Ustawianie useState'ów
    const [url, setUrl] = useState("http://localhost:8000/posts")
    const [posts, setPosts] = useState([])

    const fetchPosts = useCallback(async()=>{
        const resp = await fetch(url);
        const data = await resp.json();
        setPosts(data);
    }, [url]);

    useEffect(()=>{
        fetchPosts();
    }, [fetchPosts])

    return(
        <Container>
            <Row>
            {

                posts.map((post)=>(
                    <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="holder.js/100px180" />
                    <Card.Body>
                        <Card.Title>{post.PostTitle}</Card.Title>
                        <Card.Text>
                        {post.PostContent}
                        </Card.Text>
                        <Button variant="primary" onClick={()=>setUrl("/posts")}>
                            Przejdź do artykułu
                            </Button>
                    </Card.Body>
                    </Card>
                ))
            }
            </Row>
        </Container>
    )
}

export default Post;