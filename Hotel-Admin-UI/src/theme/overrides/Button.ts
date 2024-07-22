import { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function Button(theme: Theme) {
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          border: `1px solid ${theme.themeColor}`,
          color: theme.themeColor,
          borderRadius: 2,
          '&:hover': {
            boxShadow: 'none',
            border: `1px solid ${theme.themeColor}`,
          },
          textTransform: "capitalize",
        },
        sizeLarge: {
          height: 48,
        },

        // contained
        containedInherit: {
          // color: theme.palette.text.primary,
          // boxShadow: theme.customShadows.z8,
          '&:hover': {
            backgroundColor: theme.palette.grey[400],
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          color: theme.palette.text.primary,
          // boxShadow: theme.customShadows.primary,
          backgroundColor: theme.themeColor,
          boxShadow: 'none',
        },
        containedSecondary: {
          // boxShadow: theme.customShadows.secondary,
        },
        containedInfo: {
          // boxShadow: theme.customShadows.info,
        },
        containedSuccess: {
          // boxShadow: theme.customShadows.success,
        },
        containedWarning: {
          // boxShadow: theme.customShadows.warning,
        },
        containedError: {
          // boxShadow: theme.customShadows.error,
        },
        // outlined
        outlinedInherit: {

          border: `1px solid ${theme.palette.grey[500_32]}`,
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        },
        textInherit: {
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        },
      },
    },
  };
}
