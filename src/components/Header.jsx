import React from "react";
import { useNavigate } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import MainIcon from "./MainIcon.jsx";


function Header(props) {
  const navigate = useNavigate();

  function handleClick() {
    navigate("/home");
  }

  function handleLogout() {
    localStorage.setItem("email", "");
    localStorage.setItem("loggedIn", "false");
    navigate("/");
  }

  return (
    <Navbar expand="lg" className="header">
        <Navbar.Brand href="/home">
            <MainIcon />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {!props.loggedIn && (
              <>
                <Nav.Link href="/">Login</Nav.Link>
                <Nav.Link href="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
          <Nav className="ml-auto">
            {props.loggedIn && (
              <>
                <Nav.Link href="/profile">Profile</Nav.Link>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
