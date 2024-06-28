// PercentageLoading


import { Theme, ThemeProvider } from "@mui/material";
import { ThemeProviderProps } from "@mui/material/styles/ThemeProvider";
import React from "react";
import { createRoot } from "react-dom/client";
import PercentageLoading from "src/components/PercentageLoading";

const showPercentageLoading = (percentValue: number, theme: Theme) => {
    const div = document.createElement("div");
    document.body.appendChild(div);

    let _root = createRoot(div);

    if (percentValue === 99) {

        _root.unmount();
        div.remove();
    }



    let element = React.createElement(PercentageLoading, {
        progress: percentValue
    });

    let themeProps: ThemeProviderProps = { theme: theme };
    let themeProviderElement = React.createElement(
        ThemeProvider,
        themeProps,
        element
    );

    _root.render(themeProviderElement);
};

export default showPercentageLoading;
