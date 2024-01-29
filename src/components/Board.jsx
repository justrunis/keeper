import React, { useState, useEffect } from 'react';
import { variables } from '../Variables';
import { makeGetRequest } from '../DatabaseRequests';

const Board = (props) => {
    const title = props.title;
    const [droppedNotes, setDroppedNotes] = useState([]);
    const [allNotes, setNotes] = useState(props.allNotes); // Set initial state with props.allNotes

    const handleDragStart = (event) => {
        event.dataTransfer.setData("text/plain", event.target.id);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const draggableElementId = event.dataTransfer.getData("text/plain");
        const draggableElement = document.getElementById(draggableElementId);
        const clonedElement = draggableElement.cloneNode(true);
        setDroppedNotes([...droppedNotes, clonedElement]);
    };

    return (
        <div>
            <h1>{title}</h1>
            <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                style={{ border: '1px solid black', minHeight: '100px' }}
            >
                {allNotes.map((note, index) => (
                    <div key={index}>
                        <h3>{note.title}</h3>
                        <p>{note.content}</p>
                    </div>
                ))}
            </div>
            <div>
                {allNotes.map((note) => (
                    <div
                        key={note.id}
                        draggable="true"
                        onDragStart={handleDragStart}
                    >
                        {note.title}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Board;
