import {
  Alert,
  Box,
  Divider,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { memo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Path } from "src/Router/path";
import Img from "src/assets/img/GujaratIMG.jpeg";
import LazyImage from "src/components/LazyImage";
import "swiper/css";
import "swiper/css/navigation";
import { TFilterProperty } from "../PropertyListByState";

interface TProps {
  FilteredPropertyList: TFilterProperty[];
}

function PropertyList({ FilteredPropertyList }: TProps) {
  const { state, country } = useParams();

  const navigate = useNavigate();

  const theme = useTheme();

  const onClickSeeAvailability = (propertyId: string, propertyName: string) => {
    // const encryptedID = Crypt.Encryption(propertyId);
    // if (encryptedID.error === "") {
    navigate(
      Path.proprty.PropertyDetail(country!, state!, propertyName, propertyId)
    );
    // }
  };

  return (
    <Rootstyle>
      <Header sx={{ color: theme.palette.text.secondary }}>
        <span style={{ color: theme.themeColor }}>{state?.split("-")[0]}:</span>{" "}
        {FilteredPropertyList.length} Properties found
      </Header>
      <Divider />

      {FilteredPropertyList.length === 0 && (
        <Alert severity="info" color="info">
          No such properties are found, try for another Country, state, city or
          change filter.
        </Alert>
      )}

      {FilteredPropertyList.map((objProperty, i) => (
        <PropertyDetailWrapper key={i}>
          <Ribbon>
            <SubTitle sx={{ color: theme.palette.color.warning.main }}>
              {objProperty.propertyType}
            </SubTitle>
          </Ribbon>
          <ImageWrapper>
            <LazyImage alt="" src={Img} style={{ height: "100%" }} />
          </ImageWrapper>

          {/* ---------------------------------------------- */}

          <MiddledContentWrapper>
            <Header>{objProperty.name}</Header>
            <SubTitle
              sx={{ color: theme.palette.color.info.main, marginTop: "0.5rem" }}
            >
              {objProperty.city}
            </SubTitle>

            <Box
              sx={{
                marginTop: "0.7rem",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              <InfoWrapper>
                <Text sx={{ color: theme.palette.text.primary, width: 100 }}>
                  Address
                </Text>
                <Text>{objProperty.address}</Text>
              </InfoWrapper>

              <InfoWrapper>
                <Text sx={{ color: theme.palette.text.primary, width: 100 }}>
                  Amenities
                </Text>
                <Amenities>
                  {objProperty.amenities.map((amen, i) => (
                    <Text>
                      {amen} {objProperty.amenities.length - 1 > i ? "," : null}
                    </Text>
                  ))}
                </Amenities>
              </InfoWrapper>

              <InfoWrapper>
                <Text sx={{ color: theme.palette.text.primary, width: 100 }}>
                  Rooms
                </Text>
                <Text>{objProperty.totalRooms}</Text>
              </InfoWrapper>

              <InfoWrapper>
                <Text sx={{ color: theme.palette.text.primary, width: 100 }}>
                  Jobs availability
                </Text>
                <Text
                  sx={{
                    color: objProperty.jobHiring
                      ? theme.palette.color.success.main
                      : theme.palette.color.rose.main,
                  }}
                >
                  {objProperty.jobHiring ? "A" : "N"}
                </Text>
              </InfoWrapper>

              {objProperty.totalRooms > 0 &&
                objProperty.availableRooms < objProperty.totalRooms &&
                (objProperty.availableRooms !== 0 ? (
                  <Text
                    sx={{
                      color: theme.palette.color.rose.main,
                      marginTop: "auto",
                    }}
                  >
                    Only {objProperty.availableRooms} room left at this price on
                    our site
                  </Text>
                ) : (
                  <Text
                    sx={{
                      color: theme.palette.color.rose.main,
                      marginTop: "auto",
                    }}
                  >
                    No Rooms left
                  </Text>
                ))}

              {objProperty.totalRooms < 1 && (
                <Text
                  sx={{
                    color: theme.palette.color.rose.main,
                    marginTop: "auto",
                  }}
                >
                  No rooms have been publish.
                </Text>
              )}
            </Box>
          </MiddledContentWrapper>

          {/* ---------------------------------------------- */}

          <RightContentWrapper>
            <ReviewScoreWrapper>
              <Box>
                <SubTitle>Review Score</SubTitle>
                <Text>{objProperty.totalReviews} reviews</Text>
              </Box>
              {objProperty.avgRating !== null && (
                <ReviewScore>
                  <SubTitle
                    sx={{
                      color: `${theme.palette.background.default} !important`,
                    }}
                  >
                    {Math.round(objProperty.avgRating * 10) / 10}
                  </SubTitle>
                </ReviewScore>
              )}
            </ReviewScoreWrapper>
            <NewToBooking>
              <SubTitle>New to Stay Swift</SubTitle>
            </NewToBooking>
            <PriceWrapper>
              <Text sx={{ textWrap: "wrap" }}>
                Max price of room for 1 night
              </Text>
              <Header sx={{ textAlign: "right" }}>
                {objProperty.maxPrice}
              </Header>
              <Text sx={{ textAlign: "right" }}>Incluging all Tax.</Text>
            </PriceWrapper>

            <SeeAvailability
              onClick={() =>
                onClickSeeAvailability(objProperty._id, objProperty.name)
              }
            >
              {" "}
              See availability
            </SeeAvailability>
          </RightContentWrapper>
        </PropertyDetailWrapper>
      ))}
    </Rootstyle>
  );
}

export default memo(PropertyList);

const Rootstyle = styled(Box)(() => ({
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "1.2rem",
  padding: "0.5rem 0.7rem",
}));

const Header = styled(Typography)(({ theme }) => ({
  fontSize: "1.2rem",
  color: theme.palette.text.primary,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

const SubTitle = styled(Typography)(({ theme }) => ({
  fontSize: "0.9rem",
  color: theme.palette.text.primary,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

const Text = styled(Typography)(({ theme }) => ({
  fontSize: "0.8rem",
  color: theme.palette.text.secondary,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

const PropertyDetailWrapper = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.text.disabled}`,
  padding: "1rem",
  display: "flex",
  alignItems: "center",
  borderRadius: "15px",
  width: "100%",
  height: 250,
  gap: "1rem",
  backgroundColor: theme.palette.background.neutral,
  position: "relative",
  overflow: "hidden",
}));

const ImageWrapper = styled(Box)(() => ({
  height: "100%",
  width: "35%",
}));

const MiddledContentWrapper = styled(Box)(() => ({
  height: "100%",
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
}));

const InfoWrapper = styled(Box)(() => ({
  display: "flex",
  gap: "5px",
}));

const Amenities = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "5px",
  flexWrap: "wrap",
  maxHeight: 40,
  flex: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

const RightContentWrapper = styled(Box)(() => ({
  display: "flex",
  height: "100%",
  flexDirection: "column",
  width: 150,
}));

const ReviewScoreWrapper = styled(Box)(() => ({
  display: "flex",
  width: "100%",
  height: "auto",
}));

const ReviewScore = styled(Box)(({ theme }) => ({
  height: 30,
  width: 30,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "5px",
  backgroundColor: theme.palette.color.info.darker,
  marginLeft: "auto",
}));

const NewToBooking = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "5px",
  backgroundColor: theme.palette.color.warning.main,
  padding: "0.2rem",
  marginTop: "0.5rem",
}));

const SeeAvailability = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "5px",
  backgroundColor: theme.themeColor,
  padding: "0.2rem",
  marginTop: "auto",
  cursor: "pointer",
}));

const PriceWrapper = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  marginTop: "1rem",
}));

const Ribbon = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "0px",
  left: "0px",
  backgroundColor: theme.palette.background.default,
  color: "#fff",
  padding: "5px 10px",
  borderRadius: "5px",
  fontWeight: "bold",
  textTransform: "uppercase",
  fontSize: "12px",
  zIndex: 1,
  transformOrigin: "0 0",
  "& span": {
    display: "block",
    textAlign: "center",
  },
}));
