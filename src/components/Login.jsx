import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import LoginIcon from '@mui/icons-material/Login';
import { variables } from "../Variables.js";
import CachedIcon from '@mui/icons-material/Cached';

const Login = (props) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")

    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();

    const [displayError, setDisplayError] = useState("");
        
    const onButtonClick = () => {
        setEmailError("")
        setPasswordError("")
        if (email === "") {
            setEmailError("Email cannot be empty")
        }
        if (password === "") {
            setPasswordError("Password cannot be empty")
        }
        if (email !== "" && password !== "") {
            const URL = variables.API_URL + "login"
            console.log(URL);
            console.log("email: " + email + " password: " + password);
            setIsLoading(true);
            fetch(URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username: email, password: password })
            })
            .then(response => {
              if (response.status >= 200 && response.status < 300) {
                  setIsLoading(false);
                  return response.json();
              } else {
                  return response.json().then(error => {
                      setIsLoading(false);
                      throw new Error(error.message);
                  });
              }
          })
          .then(data => {
              props.setLoggedIn(true);
              props.setEmail(email);
              navigate("/profile");
          })
          .catch(error => {
              setIsLoading(false);
              setDisplayError(error.message);
              const errorElement = document.querySelector('.alert.alert-danger');
              if (errorElement) {
                  errorElement.style.display = 'block';
              }
              console.error('Log in error:', error.message);
          });
        }
    }

    return (
      <div>
      <Header />
        <div className={"mainContainer"}>
          <div className={"titleContainer"}>
            <div>Login</div>
          </div>
          <br />
          <div className={'flexContainer'}>
            <div className='alert alert-danger' style={{display: 'none'}}>{displayError}</div>
            <div className={"inputContainer"}>
              <label htmlFor="username">Username</label>
              <input
                value={email}
                placeholder="Enter your username here"
                onChange={(ev) => setEmail(ev.target.value)}
                className={"inputBox"}
                type="email"
                name="username"
              />
              <label className="errorLabel">{emailError}</label>
            </div>
            <br />
            <div className={"inputContainer"}>
              <label htmlFor="password">Password</label>
              <input
                value={password}
                placeholder="Enter your password here"
                onChange={(ev) => setPassword(ev.target.value)}
                className={"inputBox"}
                type="password"
                name="password"
              />
              <label className="errorLabel">{passwordError}</label>
            </div>
          </div>
          <br />
            <div className={"inputContainer"}>
              <button className={"inputButton"} onClick={onButtonClick} disabled={isLoading}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {isLoading ? <span>Loading... <CachedIcon /></span> : <span>Log in <LoginIcon style={{ marginLeft: "5px" }}/></span> }
                </div>
              </button>
            </div>
        </div>
        <Footer />
      </div>
    );
}

export default Login;