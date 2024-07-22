import { Theme, ThemeProvider } from "@mui/material";
import React from "react";
import { createRoot } from "react-dom/client";
import { toast } from "sonner";
import { ToastMessageCard } from "src/components/ToastMessageCard";
// Adjust the import path accordingly

interface PrimaryButton {
    label: string;
    callback: () => void;
}

export const ShowTostMessage = (
    theme: Theme,
    variant: "success" | "error" | "info" | "warning",
    title: string,
    description: string,
    customButton?: PrimaryButton
) => {
    const div = document.createElement("div");
    document.body.appendChild(div);

    const root = createRoot(div);

    const handleClose = () => {
        root.unmount();
        div.remove();
    };

    setTimeout(() => {
        handleClose();
    }, 5000);

    const element = React.createElement(ToastMessageCard, {
        theme: theme,
        variant: variant,
        title: title,
        description: description,
        customButton: customButton!,
    });

    const themeProviderElement = React.createElement(
        ThemeProvider,
        { theme: theme },
        element
    );

    root.render(themeProviderElement);
    toast(themeProviderElement);
};
