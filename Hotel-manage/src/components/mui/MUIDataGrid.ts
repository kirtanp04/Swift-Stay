import { styled, Theme } from '@mui/material';

import { DataGrid } from '@mui/x-data-grid';

function customCheckbox(theme: Theme) {
    return {
        '& .MuiCheckbox-root svg': {
            width: 16,
            height: 16,
            backgroundColor: 'transparent',
            border: `1px solid ${theme.palette.mode === 'dark' ? '#919eab' : '#637381'}`, //'#ffffffa6' : 'rgb(67, 67, 67)'}`,
            borderRadius: 2,
        },
        '& .MuiCheckbox-root svg path': {
            display: 'none',
        },
        '& .MuiCheckbox-root.Mui-checked:not(.MuiCheckbox-indeterminate) svg': {
            backgroundColor: theme.palette.primary.dark, // '#1890ff',
            borderColor: theme.palette.primary.dark, // '#1890ff',
        },
        '& .MuiCheckbox-root.Mui-checked .MuiIconButton-label:after': {
            position: 'absolute',
            display: 'table',
            border: '2px solid #fff',
            borderTop: 0,
            borderLeft: 0,
            transform: 'rotate(45deg) translate(-50%,-50%)',
            opacity: 1,
            transition: 'all .2s cubic-bezier(.12,.4,.29,1.46) .1s',
            content: '""',
            top: '50%',
            left: '39%',
            width: 5.71428571,
            height: 9.14285714,
        },
        '& .MuiCheckbox-root.MuiCheckbox-indeterminate .MuiIconButton-label:after': {
            width: 8,
            height: 8,
            backgroundColor: '#1890ff',
            transform: 'none',
            top: '39%',
            border: 0,
        },
        [theme.breakpoints.down('sm')]: {
            '& .MuiCheckbox-root svg': {
                width: `13px !important`,
                height: `13px !important`,
            },
        },
    };
}

export const MUIDataGrid = styled(DataGrid)(({ theme }) => ({
    border: 0,
    color: theme.palette.mode === 'light' ? 'rgba(0,0,0,.85)' : 'rgba(255,255,255,0.85)',
    fontFamily: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"'].join(','),
    WebkitFontSmoothing: 'auto',
    letterSpacing: 'normal',
    '& .MuiDataGrid-columnHeader': {
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.background.paper,
    },
    // '& .MuiDataGrid-iconSeparator': {
    //   display: 'none',
    // },
    '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
        borderBottom: `1px solid ${theme.palette.mode === 'dark' ? theme.palette.grey[50012] : theme.palette.grey[50012]}`,
    },
    '& .MuiDataGrid-cell': {
        borderRight: `1px solid ${theme.palette.mode === 'dark' ? theme.palette.grey[50012] : theme.palette.grey[50012]}`,
        backgroundColor: theme.palette.background.neutral
        // color: theme.palette.mode === 'light' ? 'rgba(0,0,0,.85)' : 'rgba(255,255,255,0.65)',
    },
    '& .MuiPaginationItem-root': {
        borderRadius: 0,
    },
    '& .MuiDataGrid-row:hover': {
        backgroundColor: 'primary.dark',
        cursor: 'pointer',
    },
    '& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer': {
        padding: '3px',
    },

    '& ::-webkit-scrollbar': {
        width: '7px',
        height: '7px',
    },
    '& ::-webkit-scrollbar-track': {
        backgroundColor: theme.palette.background.neutral,
    },
    '& ::-webkit-scrollbar-thumb': {
        backgroundColor: theme.palette.grey[500],
    },

    // Media query for small screens

    [theme.breakpoints.down('sm')]: {
        '& .MuiDataGrid-cell': {
            fontSize: '0.7rem !important',
        },
    },
    ...customCheckbox(theme),
}));
