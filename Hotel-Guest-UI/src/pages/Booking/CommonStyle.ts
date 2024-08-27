import { Box, Divider, styled, Typography } from "@mui/material";
import LoadingSkeleton from "src/components/Skeleton";

export const FlexWrapper = styled(Box)(() => ({
    display: "flex",
    alignItems: "center",
    margin: 0,
    gap: "10px",
    width: "100%",
}));

export const LoadingFlexWrapper = styled(LoadingSkeleton)(() => ({
    display: "flex",
    alignItems: "center",
    margin: 0,
    gap: "10px",
    width: "100%",

}));

export const MUIDivider = styled(Divider)(() => ({
    margin: "1rem 0rem",
}));

export const SubTitle = styled(Typography)(({ theme }) => ({
    fontSize: "1rem",
    color: theme.palette.text.primary,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "flex",
    alignItems: "center",
    fontWeight: 600,
}));

export const Text = styled(Typography)(({ theme }) => ({
    fontSize: "0.8rem",
    color: theme.palette.text.secondary,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "flex",
    alignItems: "center",
}));

export const StackSpaceBetween = styled(Box)(() => ({
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
}));