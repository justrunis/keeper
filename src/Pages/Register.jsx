import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { variables } from "../Variables.js";

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

    const [displayError, setDisplayError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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
        let isValid = true;

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
        if(formData.email !== "" && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)) {
            newFormErrors.emailError = "Invalid email address";
            isValid = false;
        }

        setFormErrors(newFormErrors);

        if (
            formData.email !== "" &&
            formData.password !== "" &&
            formData.username !== "" &&
            formData.date_of_birth !== "" &&
            formData.gender !== "" &&
            isValid
        ) {
            const URL = variables.API_URL + "register";
            setIsLoading(true);
            fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(error => {
                        setIsLoading(false);
                        throw new Error(error.message);
                    });
                }
                return response.json();
            })
            .then(data => {
                props.handleLogin(true, formData.email);
                navigate("/");
            })
            .catch(error => {
                setIsLoading(false);
                setDisplayError(error.message);
                document.getElementsByClassName('alert alert-danger')[0].style.display = 'block';
                console.error('Registration error:', error.message);
            });
        }
    }

    return (
        <div>
            <Header />
            <div className={"mainContainer"}>
                <div className={"titleContainer"}>
                    <div>Register</div>
                </div>
                <div className={"flexContainer"}>
                    <div className='alert alert-danger' style={{display: 'none'}}>{displayError}</div>
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

                    <button
                        className={"inputButton"}
                        type="button"
                        onClick={onButtonClick}
                        disabled={isLoading}>
                        {isLoading ? <span>Loading</span> : <span>Register</span>}
                    </button>
                </div>
                <div className={"inputContainer"}>
                    <p className={"mt-3"}>
                    Already have an account? <Link to="/">Log in</Link>
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Register;
