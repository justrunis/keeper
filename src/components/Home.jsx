import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import CreateArea from "./CreateArea";
import { variables } from "../Variables";
import { makePostRequest, makeGetRequest } from "../DatabaseRequests.js";
import Board from "./Board";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function Home(props) {
    const email = localStorage.getItem("email") || props.email;
    const loggedIn = localStorage.getItem("loggedIn") === "true" || props.loggedIn;
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const URL = variables.API_URL + 'getNotes/' + email;
            const data = await makeGetRequest(URL);
            setNotes(data);
        };

        if (loggedIn) {
            fetchData();
        }
    }, [loggedIn, email]);

    const addNote = async (newNote) => {
        newNote.email = email;

        const URL = variables.API_URL + "addNote";

        if (newNote.title !== "" && newNote.content !== "" && newNote.color !== "") {
            try {
                newNote.category = variables.CATEGORIES[0].value.toLowerCase();
                const id = await makePostRequest(URL, newNote);
                newNote.id = id;

                // Update the state with the new note
                setNotes(prevNotes => [...prevNotes, newNote]);
            } catch (error) {
                console.error('Error adding note:', error);
            }
        }
    }

    const handleNoteDropped = (noteId, newCategory) => {
        setNotes(prevNotes => {
            return prevNotes.map(note => {
                if (note.id === noteId) {
                    return {
                        ...note,
                        category: newCategory
                    };
                }
                return note;
            });
        });
    };

    const handleNoteDroppedOnDifferentBoard = (noteId, newCategory) => {
        setNotes(prevNotes => {
            // Remove the note from the source board
            const updatedNotes = prevNotes.filter(note => note.id !== noteId);

            // Add the note to the target board
            const updatedNote = prevNotes.find(note => note.id === noteId);
            const targetBoardNotes = updatedNote ? [...updatedNotes, { ...updatedNote, category: newCategory }] : updatedNotes;

            return targetBoardNotes;
        });
    };

    if (!loggedIn) {
        window.location.href = "/";
    }

    localStorage.setItem("email", email);
    localStorage.setItem("loggedIn", loggedIn ? "true" : "false");

    return (
        <DndProvider backend={HTML5Backend}>
            <div>
                <Header loggedIn={loggedIn} />
                <CreateArea onAdd={addNote} />
                <div className="boards">
                    {variables.CATEGORIES.map((category) => (
                        <Board
                            key={category.name}
                            email={email}
                            loggedIn={loggedIn}
                            title={category.name}
                            boardColor={category.color}
                            notes={notes.filter(note => note.category.toLowerCase() === category.value.toLowerCase())}
                            onNoteDropped={handleNoteDropped}
                            onNoteDroppedOnDifferentBoard={handleNoteDroppedOnDifferentBoard}
                            setNotes={setNotes}
                        />
                    ))}
                </div>
                <Footer />
            </div>
        </DndProvider>
    );
}

export default Home;
