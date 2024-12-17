import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Container, Alert, Form } from "react-bootstrap";

const EditPost = () =>{
    const { id } = useParams();
    
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const fetchPosts = useCallback(async ()=>{
        const postResponse = await fetch(`http://localhost:8000/posts/${id}`);
        if(!postResponse.ok){
            setError("Nie udało się zczytać zasobów postu!");
            return;
        }
        const postData = await postResponse.json();

        setTitle(postData.PostTitle);
        setContent(postData.PostContent);
    }, [])

    useEffect(()=>{
        fetchPosts();
    }, [fetchPosts]);


    const handleSubmit = async (event) =>{
        event.preventDefault();
        try{

            const resp = await fetch(`http://localhost:8000/posts/${id}`, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json"
                },
                body : JSON.stringify({
                  PostTitle: title,
                  PostContent: content
                })
              })
            if(resp.ok){
                setSuccess(true);
                setError(null);
                setTitle("");
                setContent("");
            }
        }
        catch(err){
            setError(err);
        }
    }

    return(
        <Container>
        <h3>Edytuj wpis numer {id}</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">Wpis został pomyślnie zedytowany!</Alert>}
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="postTitle">
            <Form.Label>Tytuł wpisu</Form.Label>
            <Form.Control
                type="text"
                placeholder="Wprowadź tytuł wpisu"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            </Form.Group>

            <Form.Group controlId="postContent">
            <Form.Label>Treść wpisu</Form.Label>
            <Form.Control
                as="textarea"
                rows={5}
                placeholder="Wprowadź treść wpisu"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            </Form.Group>

            <Button variant="primary" type="submit" className="btn-custom btn-custom-primary">
            Edytuj wpis
            </Button>
        </Form>
    </Container>
    )
}

export default EditPost;