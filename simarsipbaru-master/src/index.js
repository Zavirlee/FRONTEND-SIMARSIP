import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
// const bodyParser = require("body-parser");
// const express = require("express");
// const app = express();

const root = ReactDOM.createRoot(document.getElementById("root"));

// app.use(bodyParser.json({ limit: "3560mb" }));
// app.use(bodyParser.urlencoded({ limit: "3560mb", extended: true }));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
