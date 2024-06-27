import { Button, ButtonProps, styled } from "@mui/material";
import React from "react";

type OmitStartEndIcons<T> = Omit<T, "startIcon" | "endIcon">;

type Props = OmitStartEndIcons<ButtonProps> & {
  children?: any;
} & (
    | { iconposition: "start"; starticon: React.ReactNode }
    | { iconposition: "end"; endicon: React.ReactNode }
  );

const MUIButton = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    "& .MuiButton-startIcon": {
      display: "none",
    },
    "& .MuiButton-endIcon": {
      display: "none",
    },
    width: 50,
    minWidth: 0,
    lineHeight: 0,
  },
}));

const Text = styled("span")(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));
const Icon = styled("span")(({ theme }) => ({
  display: "none",
  [theme.breakpoints.down("sm")]: {
    display: "block",
    fontSize: "18px",
  },
}));

export const RESIconButton = (Props: Props): any => {
  if (Props.iconposition === "start") {
    return (
      <MUIButton {...Props} startIcon={Props.starticon}>
        <Icon>{Props.starticon}</Icon>
        <Text>{Props.children}</Text>
      </MUIButton>
    );
  }
  if (Props.iconposition === "end") {
    return (
      <MUIButton {...Props} endIcon={Props.endicon}>
        <Icon>{Props.endicon}</Icon>
        <Text>{Props.children}</Text>
      </MUIButton>
    );
  }
};
