import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import ColorSelect from "./ColorSelect";
import { useDrag } from "react-dnd";
import { toast } from "react-toastify";

function Note(props) {
  var selectedColor = props.color;

  const [note, setNote] = useState({
    title: props.title,
    content: props.content,
    color: selectedColor,
  });

  function handleDeleteClick() {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );
    if (isConfirmed) {
      props.onDelete(props.id);
      const deleteMessage = "The note has been deleted";
      toast.success(deleteMessage);
    }
  }

  function handleEditClick() {
    props.onEdit(props.id);
  }

  function handleTitleChange(event) {
    setNote({ ...note, title: event.target.value });
  }

  function handleContentChange(event) {
    setNote({ ...note, content: event.target.value });
  }

  function handleColorChange(color) {
    console.log("selectedColor", color);
    setNote({ ...note, color: color });
    selectedColor = color;
  }

  function handleSaveClick() {
    if (note.title.trim() === "") {
      const errorMessage = "Title is required";
      toast.error(errorMessage);
      return;
    }

    if (note.title.length >= 255) {
      const errorMessage = "Title must be smaller than 255 characters";
      toast.error(errorMessage);
      return;
    }

    if (note.content.trim() === "") {
      const errorMessage = "Note content is required";
      toast.error(errorMessage);
      return;
    }

    if (note.content.length >= 1000) {
      const errorMessage = "Note content must be smaller than 1000 characters";
      toast.error(errorMessage);
      return;
    }

    if (note.color.trim() === "") {
      const errorMessage = "Color is required";
      toast.error(errorMessage);
      return;
    }

    props.onSave(props.id, note.title, note.content, note.color);
    const successMessage = "Note has been updated";
    toast.success(successMessage);
  }

  function handleCancelClick() {
    setNote({
      title: props.title,
      content: props.content,
      color: selectedColor,
    });
    props.onEdit(null);
  }

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "NOTE",
    item: {
      id: props.id,
      category: props.category,
      order_number: props.order_number,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="note"
      style={{ backgroundColor: note.color, opacity: isDragging ? 0.5 : 1 }}
    >
      {props.needsEdit ? (
        <>
          <div className="edit-note">
            <input
              className="inputContainer"
              type="text"
              value={note.title}
              onChange={handleTitleChange}
            />
            <textarea
              className="inputContainer"
              value={note.content}
              onChange={handleContentChange}
            />
            <ColorSelect
              onColorChange={handleColorChange}
              noteColor={note.color}
              className="mb-5"
            />

            <div className="button-container">
              <button
                className="btn"
                style={{ color: "black" }}
                onClick={handleSaveClick}
              >
                <SaveIcon />
              </button>
              <button
                className="btn"
                style={{ color: "black" }}
                onClick={handleCancelClick}
              >
                <CancelIcon />
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <h1 style={{ fontWeight: 700 }}>{note.title}</h1>
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
