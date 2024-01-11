import React, { useState } from "react";
import Login from "./Login";
import Home from "./Home";
import Register from "./Register";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  
  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState("")

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
      <Route path="/home" element={<Home email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>} />
      <Route path="/register" element={<Register setLoggedIn={setLoggedIn} setEmail={setEmail}/>} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
