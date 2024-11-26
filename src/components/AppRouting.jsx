import React from "react";
import {Routes, Route} from 'react-router-dom'
import Home from '../pages/Home'
import NotFound from "../pages/NotFound";
import Post from "../pages/Post";

const AppRouting = () =>{
    return(
        <>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/post/:id" element={<Post/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </>
    )
}

export default AppRouting