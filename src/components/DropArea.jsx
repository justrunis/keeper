// DropArea.js
import React from "react";
import { useDrop } from "react-dnd";

const DropArea = ({ area_id, onDrop }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "NOTE",
    drop: async (item, monitor) => {
      onDrop(item.id, area_id);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className="draggable-container"
      style={{
        backgroundColor: isOver ? "yellow" : "red",
      }}
    ></div>
  );
};

export default DropArea;
