import React from "react";
import {redirect} from "react-router-dom";

export function parseJwt(token) {
    try{
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}

export function AuthVerify(token) {
    if (token) {
        const decodedToken = parseJwt(token);
        
        if (decodedToken && decodedToken.exp && decodedToken.exp * 1000 < new Date().getTime()) {
            localStorage.removeItem("jwtToken");
            redirect("/");
        }
    }
}

export function getUserEmail(token) {
    const decodedToken = parseJwt(token);
    return decodedToken.userEmail;
}

export function getUserId(token) {
    const decodedToken = parseJwt(token);
    return decodedToken.userId;
}

export function getUserRole(token) {
    const decodedToken = parseJwt(token);
    return decodedToken.userRole;
}