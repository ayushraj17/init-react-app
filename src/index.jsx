import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./App";
import Curriculum from "./Curriculum";
import { Drag } from "./Drag";

ReactDOM.render(
  <React.StrictMode>
    {/* <App /> */}
    <div style={{ display: "flex", gap: "10rem" }}>
      {/* <Curriculum /> */}
      <Drag />
    </div>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
