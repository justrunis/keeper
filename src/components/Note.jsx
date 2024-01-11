import React from "react";
import DeleteIcon from '@mui/icons-material/Delete';

function Note(props) {

  function handleClick() {
    props.onDelete(props.id);
  }

  return (
    <div className="note" style={{ 
      backgroundColor: props.color, 
      border: `5px solid white`,  // Use fadedColor for the border color
    }}>
      <h1>{props.title}</h1>
      <p>{props.content}</p>
      <button className="btn" onClick={handleClick}><DeleteIcon /></button>
    </div>
  );
}


export default Note;