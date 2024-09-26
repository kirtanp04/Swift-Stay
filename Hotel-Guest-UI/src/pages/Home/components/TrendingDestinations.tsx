import { Box, Grid, styled, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LazyImage from "src/components/LazyImage";
import useUserSearch from "src/hooks/useUserSearch";
import { Property } from "src/ObjMgr/Property";
import { Path } from "src/Router/path";

type Props = {
  Properties: Property[];
};

export default function TrendingDestinations({ Properties }: Props) {
  const {
    UserSearchObj: { selectedCountry },
  } = useUserSearch();
  const navigate = useNavigate();

  const SeeAvailability = (
    propertyName: string,
    propertyId: string,
    state: string
  ) => {
    navigate(
      Path.proprty.PropertyDetail(
        selectedCountry,
        state,
        propertyName,
        propertyId
      )
    );
  };
  return (
    <Box>
      <GridContainer container gap={"10px"} xl={12} justifyContent={"center"}>
        <SubGrid
          xl={5}
          lg={5.5}
          sx={{ cursor: "pointer" }}
          onClick={() =>
            SeeAvailability(
              Properties[0].name,
              Properties[0]._id,
              Properties[0].state
            )
          }
        >
          <LazyImage
            alt={Properties[0].name}
            src={Properties[0].images[0]}
            style={{ width: "100%", height: 230 }}
          />
          <StateName>
            {Properties[0].name + " | " + Properties[0].state.split("-")[0]}
          </StateName>
        </SubGrid>

        <SubGrid
          xl={5}
          lg={5.5}
          sx={{ cursor: "pointer" }}
          onClick={() =>
            SeeAvailability(
              Properties[1].name,
              Properties[1]._id,
              Properties[1].state
            )
          }
        >
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
        <SubGrid
          xl={3.5}
          lg={3.5}
          sx={{ height: 230, cursor: "pointer" }}
          onClick={() =>
            SeeAvailability(
              Properties[2].name,
              Properties[2]._id,
              Properties[2].state
            )
          }
        >
          <LazyImage
            alt={Properties[2].name}
            src={Properties[2].images[0]}
            style={{ width: "100%", height: "100%" }}
          />
          <StateName>
            {Properties[2].name + " | " + Properties[2].state.split("-")[0]}
          </StateName>
        </SubGrid>

        <SubGrid
          xl={3.5}
          lg={3.5}
          sx={{ height: 230, cursor: "pointer" }}
          onClick={() =>
            SeeAvailability(
              Properties[3].name,
              Properties[3]._id,
              Properties[3].state
            )
          }
        >
          <LazyImage
            alt={Properties[3].name}
            src={Properties[3].images[0]}
            style={{ width: "100%", height: "100%" }}
          />
          <StateName>
            {Properties[3].name + " | " + Properties[3].state.split("-")[0]}
          </StateName>
        </SubGrid>

        <SubGrid
          xl={3.5}
          lg={3.5}
          sx={{ height: 230, cursor: "pointer" }}
          onClick={() =>
            SeeAvailability(
              Properties[4].name,
              Properties[4]._id,
              Properties[4].state
            )
          }
        >
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
