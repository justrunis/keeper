import React, { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import CreateArea from "../components/CreateArea.jsx";
import { variables } from "../Variables.js";
import { makePostRequest, makeGetRequest } from "../DatabaseRequests.js";
import Board from "../components/Board.jsx";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function Home(props) {
    const {token} = props;
    console.log(token);
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const URL = variables.API_URL + 'getNotes';
            const data = await makeGetRequest(URL);
            // handle error later
            setNotes(data);
        };

        if (token) {
            fetchData();
        }
    }, [token]);

    const addNote = async (newNote) => {

        const URL = variables.API_URL + "addNote";
        console.log(URL);

        if (newNote.title !== "" && newNote.content !== "" && newNote.color !== "") {
            try {
                newNote.category = variables.CATEGORIES[0].value.toLowerCase();
                newNote.token = token;
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

    return (
        <DndProvider backend={HTML5Backend}>
            <div>
                <Header token={token} />
                <CreateArea onAdd={addNote} />
                <div className="boards">
                    {variables.CATEGORIES.map((category) => (
                        <Board
                            key={category.name}
                            token={token}
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
