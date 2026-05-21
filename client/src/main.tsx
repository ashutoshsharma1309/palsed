import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#111",
            color: "#f7f7f7",
            border: "1px solid #c8ff3d",
            borderRadius: "12px",
            fontFamily: "Inter, sans-serif",
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
