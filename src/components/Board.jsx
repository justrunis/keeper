import React, { useState, useEffect } from 'react';
import { variables } from '../Variables';
import { makeGetRequest, makeDeleteRequest, makePatchRequest } from '../DatabaseRequests';
import Note from './Note';
import { useDrop } from 'react-dnd';

const Board = (props) => {
    const {email, title, notes, onNoteDropped, onNoteDroppedOnDifferentBoard, setNotes, boardColor} = props;
    const [needsEdit, setNeedsEdit] = useState(null);


    const [{ isOver }, drop] = useDrop({
            accept: 'NOTE',
            drop: async (item, monitor) => {
                console.log(`Dropped note with ID ${item.id} onto board ${title}`);
                const updatedNote = await makePatchRequest(variables.API_URL + 'editCategory/' + item.id, {
                  category: title.toLowerCase(),
                });
            
                // Update the state of the source board
                onNoteDropped(item.id, updatedNote.category);
            
                // If the drop happened on a different board, update the state of the target board
                if (title.toLowerCase() !== item.category.toLowerCase()) {
                  onNoteDroppedOnDifferentBoard(item.id, updatedNote.category);
                }
            },
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
            }),
        });

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
        <div ref={drop}>
        <h2>{title}</h2>
        <div className="board-container" style={{ backgroundColor: boardColor }}>
          {notes.map((note) => (
            <Note
              key={note.id}
              id={note.id}
              title={note.title}
              content={note.content}
              color={note.color}
              category={note.category}
              needsEdit={needsEdit === note.id}
              onDelete={deleteNote}
              onEdit={enableEdit}
              onSave={editNote}
            />
          ))}
        </div>
      </div>
    );
};

export default Board;
