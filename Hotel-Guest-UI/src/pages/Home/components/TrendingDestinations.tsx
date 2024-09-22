import { Box, Grid, styled, Typography } from "@mui/material";
import LazyImage from "src/components/LazyImage";
import { Property } from "src/ObjMgr/Property";

type Props = {
  Properties: Property[];
};

export default function TrendingDestinations({ Properties }: Props) {
  return (
    <Box>
      <GridContainer container gap={"10px"} xl={12} justifyContent={"center"}>
        <SubGrid xl={5} lg={5.5}>
          <LazyImage
            alt={Properties[0].name}
            src={Properties[0].images[0]}
            style={{ width: "100%", height: 230 }}
          />
          <StateName>
            {Properties[0].name + " | " + Properties[0].state.split("-")[0]}
          </StateName>
        </SubGrid>
        <SubGrid xl={5} lg={5.5}>
          <LazyImage
            alt={Properties[1].name}
            src={Properties[1].images[0]}
            style={{ width: "100%", height: 230 }}
          />
          <StateName>
            {Properties[1].name + " | " + Properties[1].state.split("-")[0]}
          </StateName>
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
            alt={Properties[2].name}
            src={Properties[2].images[0]}
            style={{ width: "100%", height: "100%" }}
          />
          <StateName>
            {Properties[2].name + " | " + Properties[2].state.split("-")[0]}
          </StateName>
        </SubGrid>

        <SubGrid xl={3.5} lg={3.5} sx={{ height: 230 }}>
          <LazyImage
            alt={Properties[3].name}
            src={Properties[3].images[0]}
            style={{ width: "100%", height: "100%" }}
          />
          <StateName>
            {Properties[3].name + " | " + Properties[3].state.split("-")[0]}
          </StateName>
        </SubGrid>

        <SubGrid xl={3.5} lg={3.5} sx={{ height: 230 }}>
          <LazyImage
            alt={Properties[4].name}
            src={Properties[4].images[0]}
            style={{ width: "100%", height: "100%" }}
          />
          <StateName>
            {Properties[4].name + " | " + Properties[4].state.split("-")[0]}
          </StateName>
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
  fontSize: "1.2rem",
  color: theme.palette.text.primary,
  textAlign: "left",
  // flex: 0.3,
  marginTop: "auto",
}));
