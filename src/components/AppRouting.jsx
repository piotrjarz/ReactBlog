import React from "react";
import {Routes, Route} from 'react-router-dom'
import Home from '../pages/Home'
import NotFound from "../pages/NotFound";
import Post from "../pages/Post";
import Gallery from "../pages/Gallery";

const AppRouting = () =>{
    return(
        <>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/posts" element={<Post/>}/>
                <Route path="/gallery" element={<Gallery/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </>
    )
}

export default AppRouting