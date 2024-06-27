import { Box, styled } from "@mui/material";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function GridHeader({ children }: Props) {
  return <Header>{children}</Header>;
}

const Header = styled(Box)(() => ({
  width: "100%",
  height: 50,
  display: "flex",
  alignItems: "center",
}));
