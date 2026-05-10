import "./index.css"; // <--- This connects the Tailwind logic to your app
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// ... rest of the file
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
