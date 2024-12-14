import React from "react";
import {Routes, Route} from 'react-router-dom'
import Home from '../pages/Home'
import NotFound from "../pages/NotFound";
import Post from "../pages/Post";
import Gallery from "../pages/Gallery";
import Login from "../pages/Login";
import Register from "../pages/Register";

const AppRouting = () =>{
    const user = localStorage.getItem("user");
    return(
        <>
            <Routes>
                <Route path="/" element={user ? <Home/>: <Login/>}/>
                <Route path="/home" element={user ? <Home/>: <Login/>}/>
                <Route path="/posts" element={user ? <Post/> : <Login/>}/>
                <Route path="/gallery" element={user ? <Gallery/>: <Login/>}/>
                <Route path="/login" element={user ? <Home/> : <Login/>}/>
                <Route path="/register" element={user ? <Home/> : <Register/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </>
    )
}

export default AppRouting