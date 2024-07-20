import { useTheme } from "@mui/material";
import { Toaster } from "sonner";

export default function Toster() {
  const theme = useTheme();
  return (
    <Toaster
      position="top-right"
      visibleToasts={5}
      expand
      toastOptions={{
        style: {
          background: theme.palette.background.default,
          border: `1px solid ${theme.palette.border}`,
          borderRadius: "15px",
        },
      }}
      theme={theme.palette.mode}
    />
  );
}
