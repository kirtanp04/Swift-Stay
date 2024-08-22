import { Theme, ThemeProvider } from "@mui/material";
import React from "react";
import { createRoot } from "react-dom/client";
import MessageDialog, { AlertServerity } from "src/components/MessageDialog";

const showMessage = (
  message: string,
  severity: AlertServerity,
  theme: Theme,
  onOK: () => void
) => {
  const div = document.createElement("div");
  document.body.appendChild(div);

  const _root = createRoot(div);

  const handleClose = () => {
    // Properly unmount the component and remove the div
    _root.unmount();
    div.remove();
  };

  const handleOkClick = () => {
    onOK(); // Execute the callback
    handleClose(); // Close the dialog after OK click
  };

  // Only render once and avoid re-rendering on further clicks
  const element = React.createElement(MessageDialog, {
    open: true,
    message: message,
    onOK: handleOkClick,
    onClose: handleClose,
    severity,
  });

  // Wrap in a theme provider
  const themeProviderElement = React.createElement(
    ThemeProvider,
    { theme },
    element
  );

  _root.render(themeProviderElement);
};

export default showMessage;
