import { Box, Grid, styled, Typography } from "@mui/material";
import Img from "src/assets/img/GujaratIMG.jpeg";
import LazyImage from "src/components/LazyImage";

type Props = {};

export default function TrendingDestinations({}: Props) {
  return (
    <Box>
      <GridContainer container gap={"10px"} xl={12} justifyContent={"center"}>
        <SubGrid xl={5} lg={5.5}>
          <LazyImage alt="" src={Img} style={{ width: "100%", height: 230 }} />
          <StateName>Gujarat</StateName>
        </SubGrid>
        <SubGrid xl={5} lg={5.5}>
          <LazyImage alt="" src={Img} style={{ width: "100%", height: 230 }} />
          <StateName>Gujarat</StateName>
        </SubGrid>
      </GridContainer>

      <GridContainer
        container
        gap={"10px"}
        justifyContent={"center"}
        sx={{ marginTop: "1rem" }}
      >
        <SubGrid xl={3.5} lg={3.5} sx={{ height: 230 }}>
          <LazyImage
            alt=""
            src={Img}
            style={{ width: "100%", height: "100%" }}
          />
          <StateName sx={{ fontSize: "0.95rem" }}>Gujarat</StateName>
        </SubGrid>
        <SubGrid xl={3.5} lg={3.5} sx={{ height: 230 }}>
          <LazyImage
            alt=""
            src={Img}
            style={{ width: "100%", height: "100%" }}
          />
          <StateName sx={{ fontSize: "0.95rem" }}>Gujarat</StateName>
        </SubGrid>
        <SubGrid xl={3.5} lg={3.5} sx={{ height: 230 }}>
          <LazyImage
            alt=""
            src={Img}
            style={{ width: "100%", height: "100%" }}
          />
          <StateName sx={{ fontSize: "0.95rem" }}>Gujarat</StateName>
        </SubGrid>
      </GridContainer>
    </Box>
  );
}

const GridContainer = styled(Grid)(() => ({
  width: "100%",
  // height: 300,
}));

const SubGrid = styled(Grid)(() => ({
  width: "100%",
  height: 300,
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  padding: "10px",
  // border: `1px solid ${theme.palette.border}`,
  borderRadius: "10px",
  flex: 2,
}));

const StateName = styled(Typography)(({ theme }) => ({
  fontSize: "1.4rem",
  color: theme.palette.text.primary,
  textAlign: "left",
  // flex: 0.3,
  marginTop: "auto",
}));
