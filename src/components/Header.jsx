import React from "react";
import HighlightIcon from '@mui/icons-material/Highlight';
import { useNavigate } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function Header() {
  const navigate = useNavigate();

  function handleClick() {
    navigate("/home");
  }

  return (
    <Navbar expand="lg" className="header">
        <Navbar.Brand href="/home">
          <h1 onClick={handleClick} style={{ cursor: "pointer" }}>
            <HighlightIcon />Keeper
          </h1>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Login</Nav.Link>
            <Nav.Link href="/register">Register</Nav.Link>
            <Nav.Link href="/profile">Profile</Nav.Link>
          </Nav>
        </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
