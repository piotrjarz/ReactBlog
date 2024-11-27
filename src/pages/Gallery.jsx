import React from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Container } from "react-bootstrap";

const Gallery = () =>{
    return(
        <Container>
            <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src="holder.js/100px180" />
                <Card.Body>
                    <Card.Title>Tytuł zdjęcia</Card.Title>
                    <Card.Text>
                    Opis zdjęcia
                    </Card.Text>
                    <Card.Footer>
                        <Card.Text>Autor zdjęcia</Card.Text>
                    </Card.Footer>
                    <Button variant="success">Lubię to</Button>
                </Card.Body>
            </Card>
        </Container>
    )
}

export default Gallery;