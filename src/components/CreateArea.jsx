import React, { useState, useEffect, useRef } from "react";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";
import ColorSelect from "./ColorSelect";
import { variables } from "../Variables";
import { toast } from "react-toastify";

function CreateArea(props) {
  const [note, setNote] = useState({ title: "", content: "", color: "" });
  const [isExpanded, setIsExpanded] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const createAreaRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (createAreaRef.current && !createAreaRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

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

    if (note.title === "") {
      const errorMessage = "Please enter a title"
      toast.error(errorMessage);
      event.preventDefault();
      return;
    }

    if (note.color === "") {
      note.color = variables.MAIN_COLOR;
    }

    if (note.content === "") {
      const errorMessage = "Please enter some content"
      toast.error(errorMessage);
      event.preventDefault();
      return;
    }

    if(note.title.length >= 255) {
      const errorMessage = "Title must be smaller than 255 characters";
      toast.error(errorMessage);
      event.preventDefault();
      return;
    }

    if(note.content.length >= 1000) {
      const errorMessage = "Note content must be smaller than 1000 characters";
      toast.error(errorMessage);
      event.preventDefault();
      return;
    }

    props.onAdd(note);
    const successMessage = `Note "${note.title}" has been added`;
    toast.success(successMessage);
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
    <div ref={createAreaRef}>
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
            <ColorSelect onColorChange={handleColorChange} />
          </div>
        )}
        <Zoom in={isExpanded}>
          <Fab onClick={submitNote} disabled={isLoading}>
            <AddIcon />
          </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;
