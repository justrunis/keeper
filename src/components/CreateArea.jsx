import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";
import ColorSelect from "./ColorSelect";

function CreateArea(props) {
  const [note, setNote] = useState({ title: "", content: "", color: "" });
  const [isExpanded, setIsExpanded] = useState(false);
  
  const [formErrors, setFormErrors] = useState({
    titleError: "",
    noteError: ""
});

  function handleChange(event) {
    const { name, value } = event.target;
    setNote((prevNote) => {
      return {
        ...prevNote,
        [name]: value,
      };
    });
  }

  function submitNote(event) {

    setFormErrors({
      emailError: "",
      passwordError: "",
      usernameError: ""
  });

    if (note.title === "") {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        titleError: "Please enter a title",
      }));
      event.preventDefault();
      return;
    }

    if (note.content === "") {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        noteError: "Please enter some content",
      }));
      event.preventDefault();
      return;
    }

    props.onAdd(note);
    setNote({
      title: "",
      content: "",
      color: "",
    });
    setFormErrors({
      titleError: "",
      noteError: "",
    });
    event.preventDefault();
  }

  function handleContentClick() {
    setIsExpanded(true);
  }

  function handleColorChange(selectedColor) {
    setNote((prevNote) => {
      return {
        ...prevNote,
        color: selectedColor,
      };
    });
  }

  return (
    <div>
      <form className="create-note">
        {isExpanded && (
          <input
            name="title"
            placeholder="Title"
            value={note.title}
            onChange={handleChange}
          />
        )}
        <label className="errorLabel">{formErrors.titleError}</label>

        <textarea
          name="content"
          placeholder="Take a note..."
          rows={isExpanded ? "2" : "1"}
          value={note.content}
          onClick={handleContentClick}
          onChange={handleChange}
        />
        <label className="errorLabel">{formErrors.noteError}</label>
        {isExpanded && (
          <div className="note-color-container">
            <ColorSelect onColorChange={handleColorChange}/>
          </div>
        )}
        <Zoom in={isExpanded}>
          <Fab onClick={submitNote}>
            <AddIcon />
          </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;
