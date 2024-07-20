import { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function Fab(theme: Theme) {
  return {
    MuiFab: {
      defaultProps: {
        color: 'primary'
      },

      styleOverrides: {
        root: {
          boxShadow: theme.customShadows.z8,
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: theme.palette.grey[400]
          }
        },
        primary: {
          boxShadow: theme.customShadows.primary,
          '&:hover': {
            backgroundColor: theme.palette.primary.darker
          }
        },
        secondary: {
          boxShadow: theme.customShadows.secondary,
          '&:hover': {
            backgroundColor: theme.palette.secondary.darker
          }
        },
        extended: {
          '& svg': {
            marginRight: theme.spacing(1)
          }
        }
      }
    }
  };
}
