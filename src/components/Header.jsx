import React from "react";
import { useNavigate } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import MainIcon from "./MainIcon.jsx";
import { getUserRole } from "../Auth/Auth.js";


function Header(props) {
  const navigate = useNavigate();
  const role = getUserRole(props.token);

  function handleLogout() {
    localStorage.removeItem("jwtToken");
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
            {!props.token && (
              <>
                <Nav.Link href="/">Login</Nav.Link>
                <Nav.Link href="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
          <Nav className="ml-auto">
            {props.token && (
              <>
                {role === 'admin' && (
                  <Nav.Link href="/users">Users</Nav.Link>
                )}
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
