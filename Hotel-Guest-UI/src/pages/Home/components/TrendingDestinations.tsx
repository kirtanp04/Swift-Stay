import { Grid } from "@mui/material";
import { styled } from "@mui/material";

type Props = {};

export default function TrendingDestinations({}: Props) {
  return (
    <RootStyle container gap={"10px"} xl={12} justifyContent={"center"}>
      <SubGrid children xl={5} lg={5.5}></SubGrid>
      <SubGrid children xl={5} lg={5.5}></SubGrid>
    </RootStyle>
  );
}

const RootStyle = styled(Grid)(() => ({
  width: "100%",
  height: 300,
}));

const SubGrid = styled(Grid)(({ theme }) => ({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  padding: "10px",
  border: `1px solid ${theme.palette.border}`,
  borderRadius: "10px",
}));
