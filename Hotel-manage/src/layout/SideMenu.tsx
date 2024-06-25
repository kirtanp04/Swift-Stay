import { Box, styled } from "@mui/material";
import { Outlet } from "react-router-dom";
import SideMenuContent from "./SideMenuContent";

type Props = {};

export default function Layout({}: Props) {
  return (
    <RootStyle>
      <SideMenuWrapper>
        <SideMenuContent />
      </SideMenuWrapper>
      <OutletWrapper>
        <Outlet />
      </OutletWrapper>
    </RootStyle>
  );
}

const RootStyle = styled(Box)(() => ({
  height: "100vh",
  display: "flex",
  width: "100vw",
  padding: "1rem",
  gap: "1rem",
}));

const SideMenuWrapper = styled(Box)(({ theme }) => ({
  height: "100%",
  width: 250,
  display: "flex",
  //   alignItems: "center",
  flexDirection: "column",
  padding: "0.7rem 1rem",
  borderRadius: "20px",
  backgroundColor: theme.palette.background.neutral,
}));

const OutletWrapper = styled(Box)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flex: 1,
  backgroundColor: theme.palette.background.neutral,
  width: "100%",
  padding: "0.7rem 1.2rem",
  borderRadius: "20px",
}));
