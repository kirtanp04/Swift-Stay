import { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function Input(theme: Theme) {
  return {
    MuiInputBase: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            '& svg': { color: theme.palette.text.disabled },
          },
        },
        input: {
          '&::placeholder': {
            opacity: 1,
            color: theme.palette.text.disabled,
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        underline: {
          '&:before': {
            borderBottomColor: theme.palette.grey[500_56],
          },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.grey[500_12],
          '&:hover': {
            backgroundColor: theme.palette.grey[500_16],
          },
          '&.Mui-focused': {
            backgroundColor: theme.palette.action.focus,
          },
          '&.Mui-disabled': {
            backgroundColor: theme.palette.action.disabledBackground,
          },
        },
        underline: {
          '&:before': {
            borderBottomColor: theme.palette.grey[500_56],
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: theme.shape.borderRadius,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.border,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.border,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.themeColor,
            borderWidth: 2,
          },
          '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.border,
            // color: theme.palette.text.secondary
          },
        },
        input: {
          '&::placeholder': {
            opacity: 1,
            color: theme.palette.text.secondary,
          },
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: theme.palette.text.secondary,
          '&.Mui-focused': {
            color: theme.themeColor,
          },
          '&.Mui-disabled': {
            color: theme.palette.text.secondary,
          },
        },
      },
    },
  };
}
