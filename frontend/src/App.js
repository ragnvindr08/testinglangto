// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import Navbar from "./pages/navbar";  // ✅ import sidebar
import "./App.css";

function Layout({ children }) {
  const location = useLocation();

  // Hide sidebar on login & register
  const hideSidebar = ["/login", "/register"].includes(location.pathname);

  return (
    <div className="app-layout">
      {!hideSidebar && <Navbar />}
      <div className={hideSidebar ? "no-sidebar" : "with-sidebar"}>
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
