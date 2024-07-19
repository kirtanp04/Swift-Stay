import { Theme, alpha } from '@mui/material/styles';

export default function Dialog(theme: Theme) {
  return {
    MuiDialog: {
      styleOverrides: {
        paper: {
          boxShadow: theme.customShadows.dialog,
          borderRadius: theme.shape.borderRadius * 2,
          '@media (max-width: 600px)': {
            margin: theme.spacing(2),
          },
          '@media (max-width: 663.95px)': {
            maxWidth: '100%',
          },
        },
        paperFullWidth: {
          width: '100%',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: theme.spacing(3, 3, 0),
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          borderTop: 0,
          borderBottom: 0,
          padding: theme.spacing(3),
          [theme.breakpoints.down("sm")]: {
            padding: "20px 10px",
          },
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          '& > :not(:first-of-type)': {
            marginLeft: theme.spacing(1.5),
          },
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#fff', 0.5), // Adjust the alpha value to control opacity
        },
      },
    },
  };
}
