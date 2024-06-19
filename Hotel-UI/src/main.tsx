import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import ThemeProvider from "./theme/index.tsx";
import { ThemeSettingCTXProvider } from "./context/ThemeSettingCTX.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <ThemeSettingCTXProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeSettingCTXProvider>
    </ThemeProvider>
  </React.StrictMode>
);
