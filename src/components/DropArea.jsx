import React from "react";
import { useDrop } from "react-dnd";

const DropArea = ({ area_id, onDrop, fullHeight }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "NOTE",
    drop: async (item, monitor) => {
      onDrop(item.id, area_id);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const containerStyle = {
    flex: fullHeight ? "1" : "none", // Use flex 1 if fullHeight, otherwise use 'none'
  };

  return (
    <div
      ref={drop}
      className="draggable-container"
      style={containerStyle}
    ></div>
  );
};

export default DropArea;
