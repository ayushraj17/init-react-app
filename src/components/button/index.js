import React from "react";

// Icons
import { ReactComponent as ArrowLeftIcon } from "../../assets/icons/arrow-left-line.svg";
import { ReactComponent as ArrowRightIcon } from "../../assets/icons/arrow-right-line.svg";
import { ReactComponent as DeleteIcon } from "../../assets/icons/delete-bin-line.svg";
import { ReactComponent as DragIcon } from "../../assets/icons/drag-move-2-fill.svg";

export const MoveButton = (props) => {
  return (
    <button
      className="tooltip"
      style={{
        cursor: "grab",
      }}
      {...props}
    >
      <span className="tooltip-text">Move</span>
      <DragIcon />
    </button>
  );
};

export const DeleteButton = (props) => {
  return (
    <button className="tooltip" {...props}>
      <span className="tooltip-text">Delete</span>
      <DeleteIcon />
    </button>
  );
};

export const IndentLeftButton = (props) => {
  return (
    <button className="tooltip" {...props}>
      <span className="tooltip-text">Outdent</span>
      <ArrowLeftIcon />
    </button>
  );
};

export const IndentRightButton = (props) => {
  return (
    <button className="tooltip" {...props}>
      <span className="tooltip-text">Indent</span>
      <ArrowRightIcon />
    </button>
  );
};
