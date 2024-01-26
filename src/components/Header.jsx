import React from "react";
import HighlightIcon from '@mui/icons-material/Highlight';
import { useNavigate } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

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
          <h1 onClick={handleClick} style={{ cursor: "pointer" }}>
            <HighlightIcon />Keeper
          </h1>
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
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
