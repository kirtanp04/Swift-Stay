import { styled, TableCell, tableCellClasses, TableRow } from "@mui/material";

export const MUITableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.color.info.darker,
        color: theme.palette.background.default,

    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },

}));


export const MUITableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        // backgroundColor: theme.palette.color.rose.lighter,
        border: `1px solid ${theme.palette.color.info.main}`,
        // border: '1px solid red'
    },
    '& .MuiTableCell-body': {
        // backgroundColor: theme.palette.color.rose.main,
        border: `1px solid ${theme.palette.color.info.main}`,

        height: 100,
        maxHeight: 'auto'
        // border: '1px solid red'
    },
    '& .MuiTableCell-root': {
        // backgroundColor: theme.palette.color.rose.main,
        padding: '0rem !important'
        // border: '1px solid red'
    },
    '& .MuiTableCell-root:first-of-type': {
        // backgroundColor: theme.palette.color.rose.main,
        paddingLeft: '0rem !important'
        // border: '1px solid red'
    },
    '&:nth-of-type(even)': {
        // backgroundColor: theme.palette.color.rose.main,
        border: `1px solid ${theme.palette.color.info.main}`,
    },
    // hide last border
    // '&:last-child td, &:last-child th': {
    //     border: 0,
    // },
}));