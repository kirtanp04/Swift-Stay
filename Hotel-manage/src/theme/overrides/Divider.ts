import { Theme } from '@mui/material/styles';

export default function DividerOverride(theme: Theme) {
    return {
        MuiDivider: {
            styleOverrides: {
                root: {
                    backgroundColor: theme.palette.border, // This sets the line color to red
                },
            },
        },
    };
}