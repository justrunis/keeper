import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import CreateArea from "./CreateArea";
import { variables } from "../Variables";
import { makePostRequest } from "../DatabaseRequests.js";
import Board from "./Board";

function Home(props) {
    const email = localStorage.getItem("email") || props.email;
    const loggedIn = localStorage.getItem("loggedIn") === "true" || props.loggedIn;

    localStorage.setItem("email", email);
    localStorage.setItem("loggedIn", loggedIn ? "true" : "false");

    async function addNote(newNote) {
        newNote.email = email;

        const URL = variables.API_URL + "addNote";

        if (newNote.title !== "" && newNote.content !== "" && newNote.color !== "") {
            try {
                newNote.category = variables.CATEGORIES[0].value.toLowerCase();
                let id = await makePostRequest(URL, newNote);
                newNote.id = id;
            } catch (error) {
                console.error('Error adding note:', error);
            }
        }
        window.location.reload(); // Temporary fix for bug where notes don't appear after adding a new note
    }

    return (
        <div>
            <Header loggedIn={loggedIn} />
            <CreateArea onAdd={addNote} />
            <div className="boards">
                {variables.CATEGORIES.map((category) => (
                    <Board email={email} loggedIn={loggedIn} title={category.name} boardColor={category.color} />
                ))}
            </div>
            <Footer />
        </div>
    );
}
export default Home;
