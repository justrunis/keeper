import React, { useState } from "react";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import { BrowserRouter, Route, Routes, redirect } from "react-router-dom";
import Profile from "./Pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthVerify } from "./Auth/Auth.js";
import Users from "./Pages/Users";

function App() {
  
  const [token, setToken] = useState(localStorage.getItem("jwtToken"));

  const handleLogin = (token) => {
    setToken(token);
  };

  AuthVerify(token);

  return (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login handleLogin={handleLogin} />} />
      <Route path="/" element={<ProtectedRoute token={token}/>}>
        <Route path="/home" element={<Home token={token} />} />
        <Route path="/profile" element={<Profile token={token}/>} />
        <Route path="/users" element={<Users token={token} />} />
      </Route>
      <Route path="/register" element={<Register handleLogin={handleLogin} />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
