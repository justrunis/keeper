import React, { useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import ColorSelect from "./ColorSelect";
import Draggable from "react-draggable";
import { useDrag } from "react-dnd";

function Note(props) {

  var selectedColor = props.color;

  const [note, setNote] = useState({
    title: props.title,
    content: props.content,
    color: selectedColor
  });

  const [formErrors, setFormErrors] = useState({
    titleError: "",
    noteError: "",
    colorError: "",
  });

  function handleDeleteClick() {
    const isConfirmed = window.confirm("Are you sure you want to delete this note?");
    if (isConfirmed) {
      props.onDelete(props.id);
    }
  }

  function handleEditClick() {
    props.onEdit(props.id);
  }

  function handleTitleChange(event) {
    setNote({ ...note, title: event.target.value });
    setFormErrors({ ...formErrors, titleError: "" });
  }

  function handleContentChange(event) {
    setNote({ ...note, content: event.target.value });
    setFormErrors({ ...formErrors, noteError: "" });
  }

  function handleColorChange(color) {
    console.log("selectedColor", color);
    setNote({ ...note, color: color });
    setFormErrors({ ...formErrors, colorError: "" });
    selectedColor = color;
  }

  function handleSaveClick() {
    setFormErrors({ titleError: "", noteError: "" });
    if (note.title.trim() === "") {
      setFormErrors({ ...formErrors, titleError: "Title is required" });
      return;
    }

    if (note.content.trim() === "") {
      setFormErrors({ ...formErrors, noteError: "Note content is required" });
      return;
    }

    if (note.color.trim() === "") {
      setFormErrors({ ...formErrors, colorError: "Color is required" });
      return;
    }

    props.onSave(props.id, note.title, note.content, note.color);
  }

  function handleCancelClick() {
    setNote({
      title: props.title,
      content: props.content,
      color: selectedColor
    });
    props.onEdit(null);
  }

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "NOTE",
    item: { id: props.id, category: props.category},
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
      <div ref={drag} className="note" style={{ backgroundColor: note.color, opacity: isDragging ? 0.5 : 1 }}>
          {props.needsEdit ? (
            <>
              <div className="edit-note">
                <input className="inputContainer" type="text" value={note.title} onChange={handleTitleChange} />
                {formErrors.titleError && <p className="errorLabel">{formErrors.titleError}</p>}
                <textarea className="inputContainer" value={note.content} onChange={handleContentChange} />
                {formErrors.noteError && <p className="errorLabel">{formErrors.noteError}</p>}
                <ColorSelect onColorChange={handleColorChange} noteColor={note.color} className="mb-5" />
                {formErrors.colorError && <p className="errorLabel">{formErrors.colorError}</p>}
                
                <div className="button-container">
                  <button className="btn" style={{ color: "black" }} onClick={handleSaveClick}>
                    <SaveIcon />
                  </button>
                  <button className="btn" style={{ color: "black" }} onClick={handleCancelClick}>
                    <CancelIcon />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <h1 style={{fontWeight: 700}}>{note.title}</h1>
              <p>{note.content}</p>
              <button className="btn" onClick={handleEditClick}>
                <EditIcon />
              </button>
              <button className="btn" onClick={handleDeleteClick}>
                <DeleteIcon />
              </button>
            </>
          )}
      </div>
  );
}

export default Note;