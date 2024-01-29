import React, { useState, useEffect } from 'react';
import { variables } from '../Variables';
import { makeGetRequest, makeDeleteRequest, makePatchRequest } from '../DatabaseRequests';
import Note from './Note';

const Board = (props) => {
    const [notes, setNotes] = useState([]);
    const [needsEdit, setNeedsEdit] = useState(null);

    const email = localStorage.getItem('email') || props.email;
    const loggedIn = localStorage.getItem('loggedIn') === 'true' || props.loggedIn;

    useEffect(() => {
        const getNotes = async () => {
            const URL = variables.API_URL + 'getNotes/' + email;
            await makeGetRequest(URL).then((data) => {
                const filteredNotes = data.filter((note) => note.category === props.title.toLowerCase());
                const sortedNotes = filteredNotes.sort((a, b) => a.id - b.id);
                
                setNotes(sortedNotes);
                return sortedNotes;
            });
        };

        if (!loggedIn) {
            return;
        } else {
            getNotes();
        }
    }, [loggedIn, email, props.title]);

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
            <h2>{props.title}</h2>
            <div className="board-container" style={{backgroundColor: props.boardColor}}>
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
            </div>
        </div>
    );
};

export default Board;
