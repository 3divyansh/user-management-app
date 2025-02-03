import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Signup from "./Component/Signup";
import Login from "./Component/Login";
import Dashboard from "./Component/Dashboard";

function PrivateRoute({ element }) {
  const isAuthenticated = localStorage.getItem("token"); // Check if user is logged in
  return isAuthenticated ? element : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
      </Routes>
    </Router>
  );
}

export default App;
