import { Slider, styled } from "@mui/material";

export const MUISlider = styled(Slider)(({ theme }) => ({
    "& .MuiSlider-thumb": {
        color: theme.palette.color.success.main,
    },
    "& .MuiSlider-track": {
        color: theme.palette.color.success.lighter,
    },
    "& .MuiSlider-valueLabel": {
        backgroundColor: theme.palette.color.success.darker,
        color: theme.palette.text.primary,
        zIndex: 20
    },
    width: '100%'
}))