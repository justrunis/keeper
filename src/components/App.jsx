import React, { useState } from "react";
import Login from "./Login";
import Home from "./Home";
import Register from "./Register";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Profile from "./Profile";

function App() {
  
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = (loggedIn, email) => {
    setLoggedIn(loggedIn);
    setEmail(email);
  };

  return (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login handleLogin={handleLogin} />} />
      <Route path="/home" element={<Home email={email} loggedIn={loggedIn} />} />
      <Route path="/register" element={<Register handleLogin={handleLogin} />} />
      <Route path="/profile" element={<Profile email={email} loggedIn={loggedIn} />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
