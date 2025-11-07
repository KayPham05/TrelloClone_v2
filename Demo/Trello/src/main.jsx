import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AppLayout from "./components/AppLayout.jsx"
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Home from "./components/Home.jsx";
import Layout from "./components/layout.jsx";
import "./index.css";
import { applyTheme, getInitialTheme } from "./components/Theme";


const CLIENT_ID = "687329356395-b7o51dhg1e35906kvmdivu0hf9ure9q9.apps.googleusercontent.com";
applyTheme(getInitialTheme());

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={CLIENT_ID}>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<AppLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Layout />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </BrowserRouter>
  </GoogleOAuthProvider>
);
