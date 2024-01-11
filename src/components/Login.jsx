import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import LoginIcon from '@mui/icons-material/Login';

const Login = (props) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    
    const navigate = useNavigate();
        
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
            props.setLoggedIn(true)
            props.setEmail(email)
            navigate("/home")
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
          <div className={"inputContainer"}>
            <input
              value={email}
              placeholder="Enter your email here"
              onChange={(ev) => setEmail(ev.target.value)}
              className={"inputBox"}
            />
            <label className="errorLabel">{emailError}</label>
          </div>
          <br />
          <div className={"inputContainer"}>
            <input
              value={password}
              placeholder="Enter your password here"
              onChange={(ev) => setPassword(ev.target.value)}
              className={"inputBox"}
            />
            <label className="errorLabel">{passwordError}</label>
          </div>
          <br />
          <div className={"inputContainer"}>
            <div className={"inputContainer"}>
              <button className={"inputButton"} onClick={onButtonClick}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  Log in <LoginIcon style={{ marginLeft: "5px" }} />
                </div>
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
}

export default Login;