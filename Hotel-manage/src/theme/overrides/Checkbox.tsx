import { Theme } from "@mui/material/styles";
import {
  CheckboxIcon,
  CheckboxCheckedIcon,
  CheckboxIndeterminateIcon,
} from "./CustomIcons";

// ----------------------------------------------------------------------

export default function Checkbox(theme: Theme) {
  return {
    MuiCheckbox: {
      defaultProps: {
        icon: <CheckboxIcon />,
        checkedIcon: <CheckboxCheckedIcon />,
        indeterminateIcon: <CheckboxIndeterminateIcon />,
      },
      styleOverrides: {
        root: {
          padding: theme.spacing(1),
          color: theme.palette.text.primary, // default color for unchecked state
          "&.Mui-checked": {
            color: theme.themeColor, // color for checked state
          },
          "&.Mui-checked.Mui-disabled, &.Mui-disabled": {
            color: theme.palette.action.disabled,
          },
          "& .MuiSvgIcon-fontSizeMedium": {
            width: 24,
            height: 24,
          },
          "& .MuiSvgIcon-fontSizeSmall": {
            width: 20,
            height: 20,
          },
          svg: {
            fontSize: 24,
            "&[font-size=small]": {
              fontSize: 20,
            },
          },
        },
      },
    },
  };
}
