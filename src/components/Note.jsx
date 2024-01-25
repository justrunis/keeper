import React, { useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

function Note(props) {
  
  const [editedTitle, setEditedTitle] = useState(props.title);
  const [editedContent, setEditedContent] = useState(props.content);
  const [formErrors, setFormErrors] = useState({
    titleError: "",
    noteError: "" 
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
    setEditedTitle(event.target.value);
    setFormErrors({ ...formErrors, titleError: "" });
  }

  function handleContentChange(event) {
    setEditedContent(event.target.value);
    setFormErrors({ ...formErrors, noteError: "" });
  }

  function handleSaveClick() {
    setFormErrors({ titleError: "", noteError: "" });
    if (editedTitle.trim() === "") {
      setFormErrors({ ...formErrors, titleError: "Title is required" });
      return;
    }

    if (editedContent.trim() === "") {
      setFormErrors({ ...formErrors, noteError: "Note content is required" });
      return;
    }

    props.onSave(props.id, editedTitle, editedContent, props.color);
  }

  return (
    <div className="note" style={{ backgroundColor: props.color }}>
      {props.needsEdit ? (
        <>
          <div className="edit-note">
            <input className="inputContainer" type="text" value={editedTitle} onChange={handleTitleChange} />
            {formErrors.titleError && <p className="errorLabel">{formErrors.titleError}</p>}
            <textarea className="inputContainer" value={editedContent} onChange={handleContentChange} />
            {formErrors.noteError && <p className="errorLabel">{formErrors.noteError}</p>}
            <button className="" style={{ color: "black" }} onClick={handleSaveClick}>
              <SaveIcon />
            </button>
          </div>
        </>
        
      ) : (
        <>
            <h1 style={{ fontWeight: "bold" }}>{props.title}</h1>
          <p>{props.content}</p>
          <button className="btn" style={{ color: "black" }} onClick={handleDeleteClick}>
            <DeleteIcon />
          </button>
          <button className="btn" style={{ color: "black" }} onClick={handleEditClick}>
            <EditIcon />
          </button>
        </>
      )}
    </div>
  );
}


export default Note;