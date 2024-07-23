import { ReactNode, createContext, useState } from "react";
import { ThemeColorPairs } from "src/Constant";

interface TProps {
  children: ReactNode;
}

const InitialValue: string = "dark";

const ThemeContext = createContext<{
  mode: string;
  ChangeMode: (mode: "light" | "dark") => void;
  themeColor: string;
  ChangeThemeColor: (color: string) => void;
}>({
  mode: InitialValue,
  ChangeMode: () => null,
  themeColor: "",
  ChangeThemeColor: () => null,
});

function ThemeSettingCTXProvider({ children }: TProps) {
  const [mode, setMode] = useState<string>(InitialValue);
  const [themeColor, setThemeColor] = useState<string>(
    mode === "dark" ? ThemeColorPairs[0].darkMode : ThemeColorPairs[0].lightMode
  );

  const ChangeMode = (modeName: "dark" | "light") => {
    setMode(modeName);
  };

  const ChangeThemeColor = (color: string) => {
    setThemeColor(color);
  };

  return (
    <ThemeContext.Provider
      value={{ mode, ChangeMode, themeColor, ChangeThemeColor }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export { ThemeContext, ThemeSettingCTXProvider };
