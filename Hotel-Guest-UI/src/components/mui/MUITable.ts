import { styled, TableCell, tableCellClasses, TableRow } from "@mui/material";

export const MUITableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.background.neutral,
        color: theme.palette.text.primary,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

export const MUITableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        // backgroundColor: theme.palette.color.rose.main,
        borderBottom: `1px solid ${theme.palette.border}`
    },
    '&:nth-of-type(even)': {
        // backgroundColor: theme.palette.color.rose.main,
        borderBottom: `1px solid ${theme.palette.border}`
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));