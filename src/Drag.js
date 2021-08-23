import React, { Component, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { list2 } from "./Curriculum";

import styles from "./styles/app.module.css";

// Icons
import { ReactComponent as ArrowLeftIcon } from "./assets/icons/arrow-left-line.svg";
import { ReactComponent as ArrowRightIcon } from "./assets/icons/arrow-right-line.svg";
import { ReactComponent as DeleteIcon } from "./assets/icons/delete-bin-line.svg";
import { ReactComponent as DragIcon } from "./assets/icons/drag-move-2-fill.svg";
import { reOrderList } from "./utils";

// fake data generator
const getItems = (count) =>
  list2.map((item) => ({ ...item, id: item.id.toString() }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "#ddd",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "white",
  padding: grid,
  width: "100%",
  position: "relative",
});

const queryAttr = "data-rbd-drag-handle-draggable-id";

const MoveButton = (props) => {
  return (
    <button {...props}>
      <DragIcon />
    </button>
  );
};

const DeleteButton = (props) => {
  return (
    <button {...props}>
      <DeleteIcon />
    </button>
  );
};

const IndentLeftButton = (props) => {
  return (
    <button {...props}>
      <ArrowLeftIcon />
    </button>
  );
};

const IndentRightButton = (props) => {
  return (
    <button {...props}>
      <ArrowRightIcon />
    </button>
  );
};

export const Drag = (props) => {
  const [placeholderProps, setPlaceholderProps] = useState({});
  const [list, setList] = useState(getItems());

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    setPlaceholderProps({});
    setList((items) =>
      reorder(items, result.source.index, result.destination.index)
    );
  };

  const onDragUpdate = (update) => {
    if (!update.destination) {
      return;
    }
    const draggableId = update.draggableId;
    const destinationIndex = update.destination.index;

    const domQuery = `[${queryAttr}='${draggableId}']`;
    const draggedDOM = document.querySelector(domQuery);

    if (!draggedDOM) {
      return;
    }
    const { clientHeight, clientWidth } = draggedDOM;

    const clientY =
      parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop) +
      [...draggedDOM.parentNode.children]
        .slice(0, destinationIndex)
        .reduce((total, curr) => {
          const style = curr.currentStyle || window.getComputedStyle(curr);
          const marginBottom = parseFloat(style.marginBottom);
          return total + curr.clientHeight + marginBottom;
        }, 0);

    setPlaceholderProps({
      clientHeight,
      clientWidth,
      clientY,
      clientX: parseFloat(
        window.getComputedStyle(draggedDOM.parentNode).paddingLeft
      ),
    });
  };

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity

  const getClosestItemToLeft = (id) =>
    Math.max(...list.map((item) => item.id).filter((prevId) => prevId < id));

  const disableRightIndent = (id, index) => {
    let result = false;
    if (index === 0) {
      result = true;
    }
    let closestItemToLeft = getClosestItemToLeft(id);
    if (list.find((item) => item.id === closestItemToLeft)) {
      result =
        list.find((item) => item.id === closestItemToLeft).order + 1 ===
        list.find((item) => item.id === id).order;
    }

    return result;
  };

  const handleIndentLeft = (id) =>
    setList(
      list.map((item) => {
        if (item.id === id) {
          item.order--;
          return item;
        }
        return item;
      })
    );

  const handleIndentRight = (id) =>
    setList(
      list.map((item) => {
        if (item.id === id) {
          item.order++;
          return item;
        }
        return item;
      })
    );

  const handleDelete = (id) => {
    const itemToDelete = list.find((item) => item.id === id);
    const indexOfItemToDelete = list.indexOf(itemToDelete);

    let index = 0;
    let finalList = list;
    // Deleting the child if/any
    while (index < list.length) {
      if (index > indexOfItemToDelete) {
        const item = list[index];

        if (item.order > itemToDelete.order) {
          // console.log(item, "if");
          finalList = finalList.filter((listItem) => listItem.id !== item.id);
        } else {
          // console.log(item, "else");
          break;
        }
      }
      index++;
    }

    // Deleting the item itself
    setList(finalList.filter((listItem) => listItem.id !== itemToDelete.id));
  };

  // ✅
  const handleInputChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setList((prevState) => {
      return prevState.map((item) => {
        if (item.id === id) {
          item.value = value;
          return item;
        }
        return item;
      });
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            {reOrderList(list).map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}
                    className={styles.parent}
                  >
                    <div>
                      <MoveButton {...provided.dragHandleProps} />
                      <DeleteButton onClick={() => handleDelete(item.id)} />
                      <IndentLeftButton
                        onClick={() => handleIndentLeft(item.id)}
                        disabled={item.order === 0}
                      />
                      <IndentRightButton
                        onClick={() => handleIndentRight(item.id)}
                        disabled={disableRightIndent(item.id, index)}
                      />
                    </div>

                    {item.order}
                    <input
                      style={{
                        marginLeft: `calc(${item.order}rem)`,
                      }}
                      value={item.value}
                      id={item.id}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
            <div
              style={{
                position: "absolute",
                top: placeholderProps.clientY,
                left: placeholderProps.clientX,
                height: placeholderProps.clientHeight,
                background: "tomato",
                width: placeholderProps.clientWidth,
              }}
            />
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
