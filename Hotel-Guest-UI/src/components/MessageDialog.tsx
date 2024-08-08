import { Alert, Box, styled, Theme, useTheme } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { CloseIcon } from "src/assets/iconify";
import Scrollbar from "./Scrollbar";

export type AlertServerity = "success" | "info" | "warning" | "error";

interface MessageDialogProps {
  open: boolean;
  message: string;
  onOK: () => void;
  onClose: () => void;
  severity: AlertServerity;
}

const MessageDialog = ({
  open,
  message,
  onClose,
  severity,
}: MessageDialogProps) => {
  const theme = useTheme();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      sx={{
        "& .MuiDialogContent-root": {
          padding: "0rem !important",
          position: "relative",
        },
      }}
    >
      <DialogContent sx={{ maxHeight: 600, height: "auto", minHeight: 100 }}>
        <Scrollbar
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Alert
            severity={severity}
            color={severity}
            // variant="filled"
            sx={{
              padding: " 0.2rem 0.5rem !important",
              minHeight: 100,
              fontSize: "1rem",
            }}
          >
            {message}
          </Alert>
        </Scrollbar>

        <CloseButton
          onClick={onClose}
          sx={{ backgroundColor: getBackgroungColor(severity, theme) }}
        >
          <CloseIcon IconColor={theme.palette.text.primary} />
          <DialogContentText
            sx={{
              color: theme.palette.text.primary,
              marginLeft: "0.2rem",
            }}
          >
            Close
          </DialogContentText>
        </CloseButton>
      </DialogContent>
    </Dialog>
  );
};

export default MessageDialog;

const getBackgroungColor = (severity: AlertServerity, theme: Theme): string => {
  let color: string = theme.palette.text.primary;

  if (severity === "error") {
    color = theme.palette.color.error.lighter;
  }

  if (severity === "info") {
    color = theme.palette.color.info.lighter;
  }

  if (severity === "success") {
    color = theme.palette.color.success.lighter;
  }

  if (severity === "warning") {
    color = theme.palette.color.warning.lighter;
  }

  return color;
};

const CloseButton = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  position: "absolute",
  bottom: "10px",
  right: "10px",
  borderRadius: "5px",
  padding: "0.2rem 0.5rem",
}));
