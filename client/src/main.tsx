import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { applyTheme, resolveInitialTheme } from "./hooks/useTheme";
import "./styles/globals.css";

// Apply the persisted (or system-derived) theme BEFORE React paints,
// so users never see a flash of the wrong palette.
applyTheme(resolveInitialTheme());

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "var(--color-card)",
            color: "var(--color-text)",
            border: "1px solid var(--color-neon)",
            borderRadius: "12px",
            fontFamily: "Inter, sans-serif",
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
