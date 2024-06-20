import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import ThemeProvider from "./theme/index.tsx";
import { ThemeSettingCTXProvider } from "./context/ThemeSettingCTX.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider
      clientId={
        "831825545652-nbaj3o8afnp1c8fl07gnc83i453bl6p8.apps.googleusercontent.com"
      }
    >
      <ThemeProvider>
        <ThemeSettingCTXProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeSettingCTXProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
