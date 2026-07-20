import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/camera.css";
import "leaflet/dist/leaflet.css";
import "./styles/cluster.css";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
