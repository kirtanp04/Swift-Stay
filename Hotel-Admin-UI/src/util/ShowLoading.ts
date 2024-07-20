// PercentageLoading


import { Theme, ThemeProvider } from "@mui/material";
import { ThemeProviderProps } from "@mui/material/styles/ThemeProvider";
import React from "react";
import { createRoot } from "react-dom/client";
import LoadingPage from "src/components/LoadingPage";

let _root: any = null;
let _div: HTMLDivElement | null = null;

const showLoading = (theme: Theme, show: boolean) => {
    if (show) {
        if (!_div) {
            _div = document.createElement("div");
            document.body.appendChild(_div);
        }

        if (!_root) {
            _root = createRoot(_div);
        }





        let element = React.createElement(LoadingPage);

        let themeProps: ThemeProviderProps = { theme: theme };
        let themeProviderElement = React.createElement(
            ThemeProvider,
            themeProps,
            element
        );

        _root.render(themeProviderElement);
    } else {
        if (_root) {
            _root.unmount();
            _root = null;
        }

        if (_div) {
            _div.remove();
            _div = null;
        }
    }
}

    ;

export default showLoading;
