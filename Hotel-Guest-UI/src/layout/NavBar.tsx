import { Box, styled } from "@mui/material";
import { Outlet } from "react-router-dom";
import NavBarContent from "./NavBarContent";
import Scrollbar from "src/components/Scrollbar";
import Footer from "./Footer";

type Props = {};

export default function Layout({}: Props) {
  return (
    <RootStyle>
      <Scrollbar>
        <NavBarWrapper>
          <NavBarContent />
        </NavBarWrapper>

        <OutletWrapper>
          <Outlet />
        </OutletWrapper>
        <Footer />
      </Scrollbar>
    </RootStyle>
  );
}

const RootStyle = styled(Box)(() => ({
  minHeight: "100vh",
  display: "flex",
  width: "100%",
  flexDirection: "column",
}));

const NavBarWrapper = styled(Box)(({ theme }) => ({
  minHeight: 70,
  width: "100%",
  display: "flex",
  flexDirection: "column",
  padding: "0.7rem 0remrem",
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
  flexDirection: "column",
}));
