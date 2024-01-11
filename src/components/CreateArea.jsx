import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";
import ColorSelect from "./ColorSelect";

function CreateArea(props) {
  const [note, setNote] = useState({ title: "", content: "", color: "" });
  const [isExpanded, setIsExpanded] = useState(false);

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
    props.onAdd(note);
    setNote({
      title: "",
      content: "",
      color: "",
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

        <textarea
          name="content"
          placeholder="Take a note..."
          rows={isExpanded ? "2" : "1"}
          value={note.content}
          onClick={handleContentClick}
          onChange={handleChange}
        />
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
