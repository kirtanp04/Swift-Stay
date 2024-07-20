import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Scrollbar from "./Scrollbar";

interface MessageDialogProps {
  open: boolean;
  message: string;
  onOK: () => void;
  onClose: () => void;
}

const MessageDialog = ({
  open,
  message,
  onOK,
  onClose,
}: MessageDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent sx={{ maxHeight: 600, height: "auto", minHeight: 80 }}>
        <Scrollbar
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <DialogContentText style={{ textAlign: "center" }}>
            {message}
          </DialogContentText>
        </Scrollbar>
      </DialogContent>
      {/* <Divider flexItem orientation="horizontal" /> */}
      <DialogActions
        sx={{
          "& .MuiDialogActions-root": {
            padding: "16px !important",
          },
        }}
      >
        <Button onClick={onOK} color="primary" variant="outlined">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MessageDialog;
