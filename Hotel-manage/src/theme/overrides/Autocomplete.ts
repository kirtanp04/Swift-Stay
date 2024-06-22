import { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function Autocomplete(theme: Theme) {
  return {
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          boxShadow: theme.customShadows.dropdown,
        },
        listbox: {
          padding: theme.spacing(0, 1),
          '& .MuiAutocomplete-option': {
            padding: theme.spacing(0.5),
            margin: theme.spacing(1, 0),
            borderRadius: theme.shape.borderRadius,
            fontSize: '0.8rem',
          },
        },
      },
    },
  };
}
