import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import ThemeProvider from "./theme/index.tsx";
import { baseUrlName } from "./Constant.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter basename={baseUrlName}>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
