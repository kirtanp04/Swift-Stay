import { ReactNode, createContext, useState } from "react";

interface TProps {
  children: ReactNode;
}

const InitialValue: string = "dark";

const ThemeContext = createContext<{
  mode: string;
  ChangeMode: (mode: "light" | "dark") => void;
}>({
  mode: InitialValue,
  ChangeMode: () => null,
});

function ThemeSettingCTXProvider({ children }: TProps) {
  const [mode, setMode] = useState<string>(InitialValue);

  const ChangeMode = (modeName: "dark" | "light") => {
    debugger;
    setMode(modeName);
  };

  return (
    <ThemeContext.Provider value={{ mode, ChangeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export { ThemeContext, ThemeSettingCTXProvider };
