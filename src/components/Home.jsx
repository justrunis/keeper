import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import { variables } from "../Variables";
import { useNavigate } from "react-router-dom";
import {makeGetRequest, makeDeleteRequest, makePostRequest, makePatchRequest } from "../DatabaseRequests.js";
import Board from "./Board";

function Home(props) {
    const [notes, setNotes] = useState([]);
    const [needsEdit, setNeedsEdit] = useState(null);

    const email = localStorage.getItem("email") || props.email;
    const loggedIn = localStorage.getItem("loggedIn") === "true" || props.loggedIn;

    localStorage.setItem("email", email);
    localStorage.setItem("loggedIn", loggedIn ? "true" : "false");

    const navigate = useNavigate();

    async function getNotes() {
        const URL = variables.API_URL + "getNotes/" + email;
        await makeGetRequest(URL).then((data) => {
            const sortedNotes = data.sort((a, b) => a.id - b.id);
            setNotes(sortedNotes);
            return sortedNotes;
        });
    }

    // Get notes from database
    useEffect(() => {
        if (!loggedIn) {
            navigate("/");
        } else {
            getNotes();
        }
    }, [loggedIn, email, navigate]);

    async function addNote(newNote) {
        newNote.email = email;

        const URL = variables.API_URL + "addNote";

        if (newNote.title !== "" && newNote.content !== "" && newNote.color !== "") {
            try {
                let id = await makePostRequest(URL, newNote);
                newNote.id = id;

                setNotes((prevNotes) => {
                    return [...prevNotes, newNote];
                });
            } catch (error) {
                // Handle error if needed
                console.error('Error adding note:', error);
            }
        }
    }

    async function deleteNote(id) {
        const URL = variables.API_URL + "deleteNote/" + id;
        try {
            await makeDeleteRequest(URL);

            setNotes((prevNotes) => {
                const updatedNotes = prevNotes.filter((noteItem) => {
                    return noteItem.id !== id;
                });
                return updatedNotes;
            });
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    }

    function enableEdit(id) {
        setNeedsEdit(id);
    }

    async function editNote(id, title, content, color) {
        const URL = variables.API_URL + "editNote/" + id;
        const updatedNote = await makePatchRequest(URL, { id: id, title: title, content: content, color: color });

        setNotes((prevNotes) => {
            return prevNotes.map((noteItem) => {
                if (noteItem.id === id) {
                    return {
                        ...noteItem,
                        title: updatedNote.title,
                        content: updatedNote.content,
                        color: updatedNote.color
                    };
                } else {
                    return noteItem;
                }
            });
        });
        setNeedsEdit(null);
    }

    return (
        <div>
            <Header loggedIn={loggedIn} />
            <CreateArea onAdd={addNote} />
            {/* <Board allNotes={notes} title="Todo"/>
            <Board allNotes={notes} title="Doing"/>
            <Board allNotes={notes} title="Done"/> */}
            {notes.map((note, index) => {
                return (
                    <Note
                        key={index}
                        id={note.id}
                        title={note.title}
                        content={note.content}
                        color={note.color}
                        needsEdit={needsEdit === note.id}
                        onDelete={deleteNote}
                        onEdit={enableEdit}
                        onSave={editNote}
                    />
                );
            })}
            <Footer />
        </div>
    );
}
export default Home;
