import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  styled,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { RESIconButton } from "../RESIconButton";
import {
  CloseIcon,
  HorizontalLineIcon,
  PlusIcon,
  SaveIcon,
} from "src/assets/iconify";

type Props = {
  onClose: () => void;
  defaultAdults: number;
  defaultChildrens: number;
  onSave: (adults: number, childrens: number) => void;
};

export default function GuestSelectionDialog({
  defaultAdults,
  defaultChildrens,
  onClose,
  onSave,
}: Props) {
  const [adults, setAdults] = useState<number>(defaultAdults);
  const [childrens, setChildrens] = useState<number>(defaultChildrens);
  const theme = useTheme();

  const OnSaveGuestSelection = () => {
    onSave(adults, childrens);
    onClose();
  };

  const AddAdults = () => {
    if (adults >= 18) {
      return;
    }
    setAdults((prev) => prev + 1);
  };

  const AddChildrens = () => {
    if (childrens >= 18) {
      return;
    }
    setChildrens((prev) => prev + 1);
  };

  const SubAdults = () => {
    if (adults <= 1) {
      return;
    }
    setAdults((prev) => prev - 1);
  };

  const SubChildrens = () => {
    if (childrens <= 0) {
      return;
    }
    setChildrens((prev) => prev - 1);
  };
  return (
    <Dialog
      open={true}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          maxWidth: 350,
          position: "relative",
          borderRadius: "5px !important",
          backgroundColor:
            theme.palette.mode === "dark"
              ? "hsl(0deg 0% 0.78%)"
              : theme.palette.background.neutral,
        },
      }}
    >
      <DialogContent sx={{ height: 120 }}>
        <Rootstyle>
          <FlexWrapper>
            <Text sx={{ width: 100 }}>Adults</Text>
            <FlexWrapper sx={{ gap: "15px" }}>
              <Button onClick={SubAdults}>
                <HorizontalLineIcon />
              </Button>
              <Text>{adults}</Text>
              <Button onClick={AddAdults}>
                <PlusIcon />
              </Button>
            </FlexWrapper>
          </FlexWrapper>

          <FlexWrapper>
            <Text sx={{ width: 100 }}> Childrens</Text>
            <FlexWrapper sx={{ gap: "15px" }}>
              <Button onClick={SubChildrens}>
                <HorizontalLineIcon />
              </Button>
              <Text>{childrens}</Text>
              <Button onClick={AddChildrens}>
                <PlusIcon />
              </Button>
            </FlexWrapper>
          </FlexWrapper>
        </Rootstyle>
      </DialogContent>
      <DialogActions>
        <FlexWrapper sx={{ justifyContent: "end" }}>
          <RESIconButton
            iconposition="start"
            starticon={<SaveIcon />}
            onClick={OnSaveGuestSelection}
          >
            Save
          </RESIconButton>
          <RESIconButton
            iconposition="start"
            starticon={<CloseIcon />}
            onClick={onClose}
          >
            Close
          </RESIconButton>
        </FlexWrapper>
      </DialogActions>
    </Dialog>
  );
}

const Rootstyle = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  margin: 0,
  gap: "10px",
  width: "100%",
  flexDirection: "column",
  height: "100%",
}));

const FlexWrapper = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  margin: 0,
  gap: "10px",
  width: "100%",
}));

const Text = styled("span")(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "14px",
  marginLeft: "0.5rem",
  fontWeight: 500,
  overflow: "hidden",
  textOverflow: "ellipsis",
  lineHeight: "20px",
  cursor: "pointer",
}));
