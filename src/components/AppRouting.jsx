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
import EditPost from "../pages/EditPost";
import AddImageForm from "../pages/AddImageForm";
import MyGallery from "../pages/MyGallery";

const AppRouting = () =>{
    const user = localStorage.getItem("user");
    const admin = localStorage.getItem("admin");
    return(
        <>
            <Routes>
                <Route path="/" element={user ? <Home/>: <Login/>}/>
                <Route path="/home" element={user ? <Home/>: <Login/>}/>
                <Route path="/gallery" element={user ? <Gallery/>: <Login/>}/>
                <Route path="/gallery/add" element={(user && (admin === 'true') ? <AddImageForm/> : <Home/>)}/>
                <Route path="/gallery/mine" element={(user && (admin === 'true') ? <MyGallery/> : <Home/>)}/>


                <Route path="/login" element={user ? <Home/> : <Login/>}/>
                <Route path="/register" element={user ? <Home/> : <Register/>}/>


                <Route path="/posts" element={user ? <Post/> : <Login/>}/>
                <Route path="/posts/add" element={(user && (admin === 'true')) ? <AddPost/> : <Login/>}/>
                <Route path="/posts/mine" element={(user && (admin === 'true')) ? <MyPosts/> : <Login/>}/>
                <Route path="/posts/:id" element={user ? <PostDetails/> : <Login/>}/>
                <Route path="/posts/edit/:id" element={(user && (admin === 'true')) ? <EditPost/> : <Home/> }/>

                <Route path="/profile" element={user ? <Profile/> : <Login/>}/> 



                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </>
    )
}

export default AppRouting