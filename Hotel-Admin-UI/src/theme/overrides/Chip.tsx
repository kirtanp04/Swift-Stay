import { Theme } from "@mui/material/styles";
//
import { CloseIcon } from "./CustomIcons";

// ----------------------------------------------------------------------

export default function Chip(theme: Theme) {
  return {
    MuiChip: {
      defaultProps: {
        deleteIcon: <CloseIcon />,
      },

      styleOverrides: {
        colorDefault: {
          "& .MuiChip-avatarMedium, .MuiChip-avatarSmall": {
            color: theme.palette.text.secondary,
          },
        },
        outlined: {
          borderColor: theme.palette.grey[500_32],
          "&.MuiChip-colorPrimary": {
            borderColor: theme.palette.primary.main,
          },
          "&.MuiChip-colorSecondary": {
            borderColor: theme.palette.secondary.main,
          },
        },
        //
        avatarColorInfo: {
          // color: theme.palette.info.contrastText,
          backgroundColor: theme.palette.color.info.darker,
        },
        avatarColorSuccess: {
          // color: theme.palette.success.contrastText,
          backgroundColor: theme.palette.color.success.darker,
        },
        avatarColorWarning: {
          // color: theme.palette.warning.contrastText,
          backgroundColor: theme.palette.color.warning.darker,
        },
        avatarColorError: {
          // color: theme.palette.error.contrastText,
          backgroundColor: theme.palette.color.error.darker,
        },
      },
    },
  };
}
