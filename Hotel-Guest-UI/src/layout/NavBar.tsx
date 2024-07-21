import { Box, styled } from "@mui/material";
import { Outlet } from "react-router-dom";
import NavBarContent from "./NavBarContent";

type Props = {};

export default function Layout({}: Props) {
  return (
    <RootStyle>
      <NavBarWrapper>
        <NavBarContent />
      </NavBarWrapper>

      <OutletWrapper>
        <Outlet />
      </OutletWrapper>
    </RootStyle>
  );
}

const RootStyle = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  width: "100%",
  // gap: "1rem",
  flexDirection: "column",
  "& ::-webkit-scrollbar": {
    width: "7px",
    height: "7px",
  },
  "& ::-webkit-scrollbar-track": {
    backgroundColor: theme.palette.background.neutral,
  },
  "& ::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.grey[500],
  },
}));

const NavBarWrapper = styled(Box)(({ theme }) => ({
  minHeight: 70,
  width: "100%",
  display: "flex",
  flexDirection: "column",
  padding: "0.7rem 1rem",
  backgroundColor: theme.palette.background.neutral,
  borderBottom: `1px solid ${theme.palette.border}`,
  alignItems: "center",
}));

const OutletWrapper = styled(Box)(() => ({
  minHeight: "calc(100vh - 80px)",
  display: "flex",
  flex: 1,
  width: "80%",
  // border: `1px solid ${theme.palette.border}`,
  margin: "auto",
  padding: "2rem",
}));
