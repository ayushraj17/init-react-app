import React from "react";
import { exportToJsonFile } from "../utils";
import uuid from "react-uuid";
const DataActions = ({ data, setData, addItem }) => {
  function onChange(event) {
    var reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(event.target.files[0]);
  }

  function onReaderLoad(event) {
    var obj = JSON.parse(event.target.result);
    setData(obj);
  }

  const ref = React.useRef();

  const addObject = () => {
    const lastItem = data.at(-1);
    const updateList = [...data];
    updateList.push({
      order: lastItem.order,
      value: "topic name",
      id: uuid(),
    });
    setData(updateList);
  };

  return (
    <div className="data-actions">
      <button onClick={addObject}>Add</button>
      <button onClick={() => exportToJsonFile(data)}>Export</button>
      <input
        type="file"
        onChange={onChange}
        ref={ref}
        style={{ display: "none" }}
      />
      <button onClick={() => ref.current.click()}>Import</button>
    </div>
  );
};

export default DataActions;
