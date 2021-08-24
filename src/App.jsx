import React, { useState } from "react";
import styles from "./styles/app.module.css";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import {
  DeleteButton,
  IndentLeftButton,
  IndentRightButton,
  MoveButton,
} from "./components/button";
import DataActions from "./components/DataActions";

import data from "./mock/list";

import {
  getItemStyle,
  getListStyle,
  getTextColor,
  reorder,
  reOrderList,
} from "./utils";

const App = () => {
  const [list, setList] = useState(data);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    setList((items) =>
      reorder(items, result.source.index, result.destination.index)
    );
  };

  const disableRightIndent = (id, index) => {
    let result = undefined;
    if (index === 0) {
      result = true;
    }

    const prevItem = list[Math.max(index - 1, 0)];
    const currentItem = list[index];

    if (currentItem.order - prevItem.order === 1) {
      result = true;
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
    <>
      <DataActions data={list} setData={setList} />
      <DragDropContext onDragEnd={onDragEnd}>
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
                      {/* Actions */}
                      <div>
                        <MoveButton {...provided.dragHandleProps} />
                        <IndentLeftButton
                          onClick={() => handleIndentLeft(item.id)}
                          disabled={item.order === 0}
                        />
                        <IndentRightButton
                          onClick={() => handleIndentRight(item.id)}
                          disabled={disableRightIndent(item.id, index)}
                        />
                        <DeleteButton onClick={() => handleDelete(item.id)} />
                      </div>
                      <input
                        style={{
                          marginLeft: `calc(${item.order * 3}rem)`,
                          color: getTextColor(item.order),
                        }}
                        value={item.value}
                        id={item.id}
                        onChange={handleInputChange}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

export default App;
