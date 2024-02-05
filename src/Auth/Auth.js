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
        if (decodedToken.exp * 1000 < new Date().getTime()) {
            localStorage.removeItem("jwtToken");
            redirect("/");
        }
    }
}

export function getUserName(token) {
    const decodedToken = parseJwt(token);
    return decodedToken.username;
}

export function getUserId(token) {
    const decodedToken = parseJwt(token);
    return decodedToken.id;
}