import React from "react";
import { useParams } from "react-router-dom";

const Post = () =>{
    let param = useParams();
    return(
        <div>
            <h1>Id - {param.id}</h1>
        </div>
    )
}

export default Post;