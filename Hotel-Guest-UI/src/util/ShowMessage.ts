import React from "react";
import { createRoot } from "react-dom/client";
import MessageDialog, { AlertServerity } from "src/components/MessageDialog";
import { ThemeProviderProps } from "@mui/material/styles/ThemeProvider";
import { Theme } from "@mui/material";
import { ThemeProvider } from "@mui/material";

const showMessage = (message: string, severity: AlertServerity, theme: Theme, onOK: () => void) => {
  const div = document.createElement("div");
  document.body.appendChild(div);

  let _root = createRoot(div);

  const handleClose = () => {
    _root.unmount();
    div.remove();
  };

  const handleOkClick = () => {
    onOK();
    handleClose();
  };
  let element = React.createElement(MessageDialog, {
    open: true,
    message: message,
    onOK: () => {
      handleOkClick();
    },
    onClose: () => {
      handleOkClick();
    },
    severity
  });

  let themeProps: ThemeProviderProps = { theme: theme };
  let themeProviderElement = React.createElement(
    ThemeProvider,
    themeProps,
    element
  );

  _root.render(themeProviderElement);
};

export default showMessage;
