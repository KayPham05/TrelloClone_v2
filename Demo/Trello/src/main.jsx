import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppLayout from "./components/AppLayout.jsx"
import Login from "./components/Login.jsx";
import Home from "./components/Home.jsx";
import Layout from "./components/layout.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<AppLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Layout />} />
      </Route>
    </Routes>
    <ToastContainer
      position="top-right" // vị trí hiển thị
      autoClose={2500} // tự đóng sau 2.5s
      hideProgressBar={false} // thanh tiến trình
      newestOnTop={false}
      closeOnClick
      pauseOnHover
      draggable
      theme="colored" // theme đẹp nhiều màu
    />
  </BrowserRouter>
);
