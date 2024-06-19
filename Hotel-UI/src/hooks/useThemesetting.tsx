import { useContext } from "react";
import { ThemeContext } from "../context/ThemeSettingCTX";

export default function useThemeSetting() {
  const useThemeSetting = useContext(ThemeContext);
  return useThemeSetting;
}
