import React, { useState } from "react";
import Login from "./Login";
import Home from "./Home";
import Register from "./Register";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Profile from "./Profile";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  
  const [token, setToken] = useState(localStorage.getItem("jwtToken"));
  console.log(token);

  const handleLogin = (token) => {
    setToken(token);
  };

  return (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login handleLogin={handleLogin} />} />
      {/* <Route path="/home" element={<ProtectedRoute><Home token={token} /></ProtectedRoute>} /> */}
      <Route path="/" element={<ProtectedRoute token={token}/>}>
        <Route path="/home" element={<Home token={token} />} />
        <Route path="/profile" element={<Profile token={token}/>} />
      </Route>
      <Route path="/register" element={<Register handleLogin={handleLogin} />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
