import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./i18n";
import "./index.css";
import "./styles/camera.css";
import "ol/ol.css";
import "./styles/cluster.css";
// Web font tự host cho nhãn bản đồ (ol-mapbox-style dùng web font thường qua
// CSS font-family, không dùng file glyph PBF như MapLibre GL JS) — bundle
// thẳng file .woff2 vào app, không gọi CDN font ngoài lúc chạy.
import "@fontsource/noto-sans/400.css";
import "@fontsource/noto-sans/700.css";
import "@fontsource/noto-sans/400-italic.css";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
