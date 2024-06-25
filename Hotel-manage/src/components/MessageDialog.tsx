import { Divider } from "@mui/material";
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
      <DialogContent sx={{ maxHeight: 600, height: "auto", minHeight: 200 }}>
        <Scrollbar sx={{ height: "100%" }}>
          <DialogContentText>{message}</DialogContentText>
        </Scrollbar>
      </DialogContent>
      <Divider flexItem orientation="horizontal" />
      <DialogActions>
        <Button onClick={onOK} color="primary" variant="outlined">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MessageDialog;
