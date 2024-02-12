import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import LoginIcon from '@mui/icons-material/Login';
import { variables } from "../Variables.js";
import CachedIcon from '@mui/icons-material/Cached';
import { toast } from "react-toastify";

const Login = (props) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")

    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();

    const onButtonClick = () => {
        setEmailError("")
        setPasswordError("")
        let isValid = true;
        if (email === "") {
          const errorMessage = "Email cannot be empty";
          setEmailError(errorMessage);
          toast.error(errorMessage);
          isValid = false;
        }
        if (password === "") {
          const errorMessage = "Password cannot be empty";
          setPasswordError(errorMessage);
          toast.error(errorMessage);
          isValid = false;
        }
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
          const errorMessage = "Invalid email address";
          setEmailError(errorMessage);
          isValid = false;
        }
        if (isValid) {
            const URL = variables.API_URL + "login"
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
              localStorage.setItem("jwtToken", data.token);
              props.handleLogin(data.token);
              const successMessage = "You have been logged in successfully";
              toast.success(successMessage);
              navigate("/home");
          })
          .catch(error => {
              setIsLoading(false);
              toast.error(error.message);
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
          <div className={"flexContainer"}>
            <div className={"inputContainer"}>
              <label htmlFor="username">Email</label>
              <input
                value={email}
                placeholder="Enter your email here"
                onChange={(ev) => setEmail(ev.target.value)}
                className={"inputBox"}
                type="email"
                name="username"
              />
              <label className="errorLabel">{emailError}</label>
            </div>
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
            <button
              className={"inputButton"}
              onClick={onButtonClick}
              disabled={isLoading}
            >
              <div>
                {isLoading ? <span>Loading... <CachedIcon /></span> : <span>Log in <LoginIcon style={{ marginLeft: "5px" }} /></span>}
              </div>
            </button>
          </div>
          <div className={"inputContainer"}>
            <p className={"mt-3"}>
              Dont have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
}

export default Login;