/**
 * Keeps the order, after 3 there won't be a 5 it auto adjusts the child to 4
 */
export const reOrderList = (items) =>
  items.map((currentItem, index) => {
    const prevItem = items[Math.max(index - 1, 0)];
    // console.log({ currentItem, prevItem });
    if (currentItem.order - prevItem.order > 1) {
      currentItem.order = prevItem.order + 1;
    }
    if (index === 0) {
      currentItem.order = 0;
    }
    if (index === 1) {
      currentItem.order = 1;
    }

    return currentItem;
  });

export const exportToJsonFile = (jsonData) => {
  let dataStr = JSON.stringify(jsonData);
  let dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  let exportFileDefaultName = "data.json";

  let linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click();
};

// a little function to help with reordering the result
export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: "1rem",
  // change background colour if dragging
  background: isDragging ? "#e7e7e7" : "#fff",
  // styles need to apply on draggables
  ...draggableStyle,
});

export const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "white",
  width: "100%",
  position: "relative",
});

export const getTextColor = (order) => {
  switch (order) {
    case 0:
      return "#35cccc";
    case 1:
      return "#000";
    case 2:
      return "#ccc";
    default:
      return "#cecece";
  }
};
