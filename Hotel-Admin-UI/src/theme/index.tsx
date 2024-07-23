import { ReactNode, useMemo } from "react";
// @mui
import { CssBaseline } from "@mui/material";
import {
  ThemeProvider as MUIThemeProvider,
  StyledEngineProvider,
  ThemeOptions,
  createTheme,
} from "@mui/material/styles";
// hooks
// import useSettings from '../hooks/useSettings';
//
import useThemeSetting from "../hooks/useThemesetting";
import componentsOverride from "./overrides";
import palette from "./palette";
import { customShadows } from "./shadows";

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
};

export default function ThemeProvider({ children }: Props) {
  const { mode, themeColor } = useThemeSetting();

  const isLight = mode === "light";

  const themeOptions: ThemeOptions = useMemo(
    () => ({
      palette: isLight ? palette.light : palette.dark,
      themeColor: themeColor,
      customShadows: isLight ? customShadows.light : customShadows.dark,
    }),
    [mode, themeColor]
  );

  const theme = createTheme(themeOptions);

  theme.components = componentsOverride(theme);

  return (
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </MUIThemeProvider>
    </StyledEngineProvider>
  );
}
