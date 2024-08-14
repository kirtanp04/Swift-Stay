import {
  Dialog,
  DialogActions,
  DialogContent,
  styled,
  useTheme,
} from "@mui/material";
import { useRef } from "react";
import { HexColorPicker } from "react-colorful";
import { CloseIcon, SaveIcon } from "src/assets/iconify";
import { RESIconButton } from "./RESIconButton";

type Props = {
  onClose: () => void;
  defaultColor?: string;
  onSet: (color: string) => void;
};

export default function ColorPickerDialog({
  onSet,
  defaultColor,
  onClose,
}: Props) {
  const theme = useTheme();
  const color: string =
    defaultColor !== undefined ? defaultColor : theme.palette.color.purple.main;
  const Color = useRef<string>(color);
  return (
    <Dialog open maxWidth="xs" fullWidth>
      <ColorPickerWrapper>
        <HexColorPicker
          color={Color.current}
          onChange={(newColor) => (Color.current = newColor)}
        />
      </ColorPickerWrapper>
      <DialogActions>
        <RESIconButton
          iconposition="start"
          starticon={<SaveIcon />}
          variant="outlined"
          type="submit"
          onClick={() => {
            onSet(Color.current);
            onClose();
          }}
        >
          Save
        </RESIconButton>
        <RESIconButton
          iconposition="start"
          starticon={<CloseIcon />}
          variant="contained"
          type="submit"
          onClick={onClose}
        >
          Close
        </RESIconButton>
      </DialogActions>
    </Dialog>
  );
}

const ColorPickerWrapper = styled(DialogContent)(({ theme }) => ({
  "& .react-colorful": {
    width: "auto",
  },
  "& .react-colorful__saturation": {
    width: "100%",
    height: 25,
  },
  "& .react-colorful__hue": {
    borderRadius: 15,
    height: 15,
  },
  "& .react-colorful__hue-pointer": {
    width: 25,
    height: 25,
  },
  "& .react-colorful__saturation-pointer": {
    width: 25,
    height: 25,
    border: `1px solid ${theme.palette.border}`,
  },
}));
