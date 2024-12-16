import React from "react";
import {Routes, Route} from 'react-router-dom'
import Home from '../pages/Home'
import NotFound from "../pages/NotFound";
import Post from "../pages/Post";
import Gallery from "../pages/Gallery";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AddPost from "../pages/AddPost";
import MyPosts from "../pages/MyPosts";
import PostDetails from "../pages/PostDetails";
import Profile from "../pages/Profile";

const AppRouting = () =>{
    const user = localStorage.getItem("user");
    const admin = localStorage.getItem("admin");
    return(
        <>
            <Routes>
                <Route path="/" element={user ? <Home/>: <Login/>}/>
                <Route path="/home" element={user ? <Home/>: <Login/>}/>
                <Route path="/posts" element={user ? <Post/> : <Login/>}/>
                <Route path="/gallery" element={user ? <Gallery/>: <Login/>}/>
                <Route path="/login" element={user ? <Home/> : <Login/>}/>
                <Route path="/register" element={user ? <Home/> : <Register/>}/>
                <Route path="/posts/add" element={(user && admin) ? <AddPost/> : <Login/>}/>
                <Route path="/posts/mine" element={user ? <MyPosts/> : <Login/>}/>
                <Route path="/posts/:id" element={user ? <PostDetails/> : <Login/>}/>
                <Route path="/profile" element={user ? <Profile/> : <Login/>}/> 

                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </>
    )
}

export default AppRouting