import React, { useState } from "react";
import { variables } from "../Variables";
import {
  makeDeleteRequest,
  makePatchRequest,
  makePostRequest,
} from "../DatabaseRequests";
import Note from "./Note";
import { useDrop } from "react-dnd";
import DropArea from "./DropArea";

const Board = (props) => {
  const {
    title,
    notes,
    onNoteDropped,
    onNoteDroppedOnDifferentBoard,
    setNotes,
    boardColor,
  } = props;
  const [needsEdit, setNeedsEdit] = useState(null);

  const [{ isOver }, drop] = useDrop({
    accept: "NOTE",
    drop: async (item, monitor) => {
      // console.log(`Dropped note with ID ${item.id} onto board ${title}`);
      const updatedNote = await makePatchRequest(
        variables.API_URL + "editCategory/" + item.id,
        {
          category: title.toLowerCase(),
        }
      );

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
      console.error("Error deleting note:", error);
    }
  }

  function enableEdit(id) {
    setNeedsEdit(id);
  }

  async function editNote(id, title, content, color) {
    const URL = variables.API_URL + "editNote/" + id;

    const updatedNote = await makePatchRequest(URL, {
      id: id,
      title: title,
      content: content,
      color: color,
    });

    setNotes((prevNotes) => {
      return prevNotes.map((noteItem) => {
        if (noteItem.id === id) {
          return {
            ...noteItem,
            title: updatedNote.title,
            content: updatedNote.content,
            color: updatedNote.color,
          };
        } else {
          return noteItem;
        }
      });
    });
    setNeedsEdit(null);
  }

  const handleDrop = (noteId, areaId) => {
    setNotes((prevNotes) => {
      const droppedNoteIndex = prevNotes.findIndex(
        (note) => note.id === noteId
      );

      const updatedNotes = [...prevNotes];
      const droppedNoteCategory = title.toLowerCase();

      updatedNotes[droppedNoteIndex].order_number = areaId + 0.5;
      updatedNotes[droppedNoteIndex].category = droppedNoteCategory;

      let order = 1;
      updatedNotes.sort((a, b) => a.order_number - b.order_number);

      for (let i = 0; i < updatedNotes.length; i++) {
        if (updatedNotes[i].category === droppedNoteCategory) {
          updatedNotes[i].order_number = order;
          order++;
        }
      }

      const URL = variables.API_URL + "editOrders";
      makePostRequest(URL, updatedNotes);
      return updatedNotes;
      // }
    });
  };

  return (
    <div>
      <h2>{title}</h2>
      <div className="board-container" style={{ backgroundColor: boardColor }}>
        <DropArea
          area_id={0}
          onDrop={handleDrop}
          fullHeight={notes.length === 0}
        />
        {notes
          .sort((a, b) => a.order_number - b.order_number)
          .map((note, index) => (
            <React.Fragment key={note.id}>
              <Note
                id={note.id}
                title={note.title}
                content={note.content}
                color={note.color}
                category={note.category}
                order_number={note.order_number}
                needsEdit={needsEdit === note.id}
                onDelete={deleteNote}
                onEdit={enableEdit}
                onSave={editNote}
              />

              <DropArea
                area_id={note.order_number}
                onDrop={handleDrop}
                fullHeight={index === notes.length - 1}
              />
            </React.Fragment>
          ))}
      </div>
    </div>
  );
};

export default Board;
