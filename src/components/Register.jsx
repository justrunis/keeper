import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Header from './Header';
import Footer from './Footer';

function Register(props) {

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        username: ""
    });

    const [formErrors, setFormErrors] = useState({
        emailError: "",
        passwordError: "",
        usernameError: ""
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const navigate = useNavigate();

    function onButtonClick() {
        
        setFormErrors({
            emailError: "",
            passwordError: "",
            usernameError: ""
        });

        if (formData.email === "") {
            setFormErrors({
                ...formErrors,
                emailError: "Email cannot be empty"
            });
        }
        if (formData.password === "") {
            setFormErrors({
                ...formErrors,
                passwordError: "Password cannot be empty"
            });
        }
        if (formData.username === "") {
            setFormErrors({
                ...formErrors,
                usernameError: "Username cannot be empty"
            });
        }
        if (formData.email !== "" && formData.password !== "" && formData.username !== "") {
            props.setLoggedIn(true)
            props.setEmail(formData.email)
            navigate("/home")
        }
        
    }

    return (
        <div>
            <Header />
            <div className={"mainContainer"}>
                <div className={"titleContainer"}>
                    <div>Register</div>
                </div>
                <br />
                <div className={"inputContainer"}>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        placeholder="Enter your username here"
                        onChange={handleInputChange}
                        className={"inputBox"}
                    />
                    <label className="errorLabel">{formErrors.usernameError}</label>
                </div>
                <br />
                <div className={"inputContainer"}>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        placeholder="Enter your email here"
                        onChange={handleInputChange}
                        className={"inputBox"}
                    />
                    <label className="errorLabel">{formErrors.emailError}</label>
                </div>
                <br />
                <div className={"inputContainer"}>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        placeholder="Enter your password here"
                        onChange={handleInputChange}
                        className={"inputBox"}
                    />
                    <label className="errorLabel">{formErrors.passwordError}</label>
                </div>
                <br />
                <div className={"inputContainer"}>
                    <input
                        className={"inputButton"}
                        type="button"
                        onClick={onButtonClick}
                        value={"Register"}
                    />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Register;
