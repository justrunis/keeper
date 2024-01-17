import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Header from './Header';
import Footer from './Footer';

function Register(props) {

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        repeatPassword: "",
        username: "",
        date_of_birth: "",
        gender: "other"
    });

    const [formErrors, setFormErrors] = useState({
        emailError: "",
        passwordError: "",
        repeatPasswordError: "",
        usernameError: "",
        date_of_birthError: "",
        genderError: ""
    });

    function handleInputChange(e){
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const navigate = useNavigate();

    function onButtonClick() {

        const newFormErrors = { 
            emailError: "",
            passwordError: "",
            repeatPasswordError: "",
            usernameError: "",
            date_of_birthError: "",
            genderError: "" 
        };

        if (formData.email === "") {
            newFormErrors.emailError = "Email cannot be empty";
        }
        if (formData.password === "") {
            newFormErrors.passwordError = "Password cannot be empty";
        }
        if (formData.repeatPassword === "") {
            newFormErrors.repeatPasswordError = "Repeat password cannot be empty";
        }
        if (formData.username === "") {
            newFormErrors.usernameError = "Username cannot be empty";
        }
        if (formData.date_of_birth === "") {
            newFormErrors.date_of_birthError = "Date of birth cannot be empty";
        }
        if (formData.gender === "") {
            newFormErrors.genderError = "Gender cannot be empty";
        }
        if (formData.password !== formData.repeatPassword) {
            newFormErrors.passwordError = "Passwords do not match";
        }

        setFormErrors(newFormErrors);

        if (
            formData.email !== "" &&
            formData.password !== "" &&
            formData.username !== "" &&
            formData.date_of_birth !== "" &&
            formData.gender !== "" &&
            formData.password === formData.repeatPassword
        ) {
            fetch('http://localhost:4000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            props.setLoggedIn(true);
            props.setEmail(formData.email);
            navigate("/home");
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
                <div className={"flexContainer"}>
                    <div className={"inputContainer"}>
                        <label htmlFor="username">Username</label>
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
                    <div className={"inputContainer"}>
                        <label htmlFor="email">Email</label>
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
                    <div className={"inputContainer"}>
                        <label htmlFor="date_of_birth">Date of birth</label>
                        <input
                            type="date"
                            name="date_of_birth"
                            value={formData.date_of_birth}
                            placeholder="Enter your birthday here"
                            onChange={handleInputChange}
                            className={"inputBox"}
                        />
                        <label className="errorLabel">{formErrors.date_of_birthError}</label>
                    </div>
                </div>
                <div className={"flexContainer"}>
                    <div className={"inputContainer"}>
                        <label htmlFor="gender">Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className={"inputBox"}
                        >
                            <option value="other">Other</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        <label className="errorLabel">{formErrors.genderError}</label>
                    </div>
                    <div className={"inputContainer"}>
                        <label htmlFor="password">Password</label>
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
                    <div className={"inputContainer"}>
                        <label htmlFor="repeatPassword">Repeat password</label>
                        <input
                            type="password"
                            name="repeatPassword"
                            value={formData.repeatPassword}
                            placeholder="Repeat your password here"
                            onChange={handleInputChange}
                            className={"inputBox"}
                        />
                        <label className="errorLabel">{formErrors.repeatPasswordError}</label>
                    </div>
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
