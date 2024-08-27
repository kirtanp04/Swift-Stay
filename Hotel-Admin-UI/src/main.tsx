import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { ThemeSettingCTXProvider } from "./context/ThemeSettingCTX.tsx";
import "./index.css";
import ThemeProvider from "./theme/index.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeSettingCTXProvider>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </ThemeSettingCTXProvider>
);
