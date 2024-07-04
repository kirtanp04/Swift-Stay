import { Box, Typography, styled, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Page from "src/components/Page";
import useAuth from "src/hooks/useAuth";
import showLoading from "src/util/ShowLoading";
import showMessage from "src/util/ShowMessage";
import { PropertyApi, PropertyClass } from "./DataObject";
import Scrollbar from "src/components/Scrollbar";
import LoadingSkeleton from "src/components/Skeleton";
import LazyImage from "src/components/LazyImage";
import { Chip } from "@mui/material";
import { getChipColor } from "./PropertyList";
import { TimeFormatter } from "src/common/TimeFormater";
import RoomCard from "./RoomCard";

type Props = {};

export default function PropertyViewer({}: Props) {
  const [Property, setProperty] = useState<PropertyClass>(new PropertyClass());
  const theme = useTheme();
  const {
    user: {
      userInfo: { id },
    },
  } = useAuth();
  const Param = useParams();
  const { property } = Param;

  useEffect(() => {
    if (Property._id === "") {
      showLoading(theme, true);
      PropertyApi.getSingleProperty(
        id,
        property!,
        (res) => {
          setProperty(res);
          showLoading(theme, false);
        },
        (err) => {
          showMessage(err, theme, () => {});
          showLoading(theme, false);
        }
      );
    }
  }, [Param]);

  return (
    <Page title={Property.name}>
      <RootStyle>
        <HeaderWrapper>
          <HeaderHotelName className="headerPropertyName">
            {Property.name}
          </HeaderHotelName>
          <HeaderHotelCity>{Property.city}</HeaderHotelCity>
        </HeaderWrapper>
        <EScrollbar>
          <ContentWrapper>
            {/* ---------------------------- top Text Content-------------------------------------- */}
            <TopContentWrapper>
              <ImageSkeleton
                isLoading={Property.images.length > 0 ? false : true}
                variant="rectangular"
              >
                <Image src={Property.images[0]} alt="Hotel pic" />
              </ImageSkeleton>

              <Scrollbar sx={{ height: "100%", width: "100%" }}>
                <TopRightContentWrapper>
                  <TextWrapper>
                    <TextSkeleton
                      isLoading={Property._id !== "" ? false : true}
                    >
                      <Label>Name :</Label>
                      <Text>{Property.name}</Text>
                    </TextSkeleton>
                  </TextWrapper>

                  <TextWrapper>
                    <TextSkeleton
                      isLoading={Property._id !== "" ? false : true}
                    >
                      <Label>Type :</Label>
                      <Chip
                        label={Property.propertyType}
                        color={getChipColor(Property.propertyType) as any}
                        variant="outlined"
                        size="small"
                        sx={{ width: 120 }}
                      />
                    </TextSkeleton>
                  </TextWrapper>

                  <TextWrapper>
                    <TextSkeleton
                      isLoading={Property._id !== "" ? false : true}
                    >
                      <Label>Address :</Label>
                      <Text>{Property.address}</Text>
                    </TextSkeleton>
                  </TextWrapper>

                  <TextWrapper>
                    <TextSkeleton
                      isLoading={Property._id !== "" ? false : true}
                    >
                      <Label>City :</Label>
                      <Text>{Property.city}</Text>
                    </TextSkeleton>
                  </TextWrapper>

                  <TextWrapper>
                    <TextSkeleton
                      isLoading={Property._id !== "" ? false : true}
                    >
                      <Label>State :</Label>
                      <Text>{Property.state}</Text>
                    </TextSkeleton>
                  </TextWrapper>

                  <TextWrapper>
                    <TextSkeleton
                      isLoading={Property._id !== "" ? false : true}
                    >
                      <Label>Country :</Label>
                      <Text>{Property.country}</Text>
                    </TextSkeleton>
                  </TextWrapper>

                  <TextWrapper>
                    <TextSkeleton
                      isLoading={Property._id !== "" ? false : true}
                    >
                      <Label>Zip Code :</Label>
                      <Text>{Property.zipCode}</Text>
                    </TextSkeleton>
                  </TextWrapper>

                  <TextWrapper>
                    <TextSkeleton
                      isLoading={Property._id !== "" ? false : true}
                    >
                      <Label>Phone :</Label>
                      <Text>{Property.phone}</Text>
                    </TextSkeleton>
                  </TextWrapper>

                  <TextWrapper>
                    <TextSkeleton
                      isLoading={Property._id !== "" ? false : true}
                    >
                      <Label>Public Email :</Label>
                      <Text>{Property.email}</Text>
                    </TextSkeleton>
                  </TextWrapper>

                  <TextWrapper>
                    <TextSkeleton
                      isLoading={Property._id !== "" ? false : true}
                    >
                      <Label>Website :</Label>
                      <Text>{Property.website}</Text>
                    </TextSkeleton>
                  </TextWrapper>

                  <TextWrapper>
                    <TextSkeleton
                      isLoading={Property._id !== "" ? false : true}
                    >
                      <Label>Description :</Label>
                      <Text>{Property.description}</Text>
                    </TextSkeleton>
                  </TextWrapper>

                  <TextWrapper>
                    <TextSkeleton
                      isLoading={Property._id !== "" ? false : true}
                    >
                      <Label>Create On :</Label>
                      <Text>
                        {TimeFormatter.formatTimeDifference(Property.createdAt)}
                      </Text>
                    </TextSkeleton>
                  </TextWrapper>

                  <TextWrapper>
                    <TextSkeleton
                      isLoading={Property._id !== "" ? false : true}
                    >
                      <Label>Last Update :</Label>
                      <Text>
                        {TimeFormatter.formatTimeDifference(Property.updatedAt)}
                      </Text>
                    </TextSkeleton>
                  </TextWrapper>

                  <TextWrapper>
                    <TextSkeleton
                      isLoading={Property._id !== "" ? false : true}
                    >
                      <Label>Ameties :</Label>
                      <AmenitiesWrapper>
                        {Property.amenities.map((amenities, index) => (
                          <AmenitiesCard key={index}>
                            <Text>{amenities}</Text>
                          </AmenitiesCard>
                        ))}
                      </AmenitiesWrapper>
                    </TextSkeleton>
                  </TextWrapper>
                </TopRightContentWrapper>
              </Scrollbar>
            </TopContentWrapper>

            {/* ----------------------------BottomWrapper Room Data -------------------------------------- */}

            <BottomWrapper>
              <BottomHeader>
                <RoomHeader>Rooms</RoomHeader>
              </BottomHeader>
              <RoomCardWrapper>
                {Property.rooms.map((objRoom) => (
                  <RoomCard key={objRoom._id} objRoom={objRoom} />
                ))}
              </RoomCardWrapper>
            </BottomWrapper>
          </ContentWrapper>
        </EScrollbar>
      </RootStyle>
    </Page>
  );
}

const RootStyle = styled(Box)(() => ({
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  paddingTop: "0.5rem",
}));

const HeaderWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  height: 60,
  borderBottom: `1px dashed ${theme.palette.divider}`,
  padding: "0.7rem",
  justifyContent: "space-between",
  paddingRight: "1rem",
}));

const HeaderHotelName = styled(Typography)(({ theme }) => ({
  fontSize: "2rem",
  color: theme.palette.text.primary,
  fontFamily: "Heading",
}));

const HeaderHotelCity = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  color: theme.palette.text.secondary,
  fontStyle: "italic",
}));

const EScrollbar = styled(Scrollbar)(() => ({
  height: "100%",
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  height: "100%",
  width: "100%",
  border: `1px dashed ${theme.palette.divider}`,
  padding: "1rem",
  borderRadius: "0px 0px 20px 20px",
}));

const TopContentWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  display: "flex",
  gap: "20px",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    alignItems: "center",
  },
}));

const BottomWrapper = styled(Box)(() => ({
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  marginTop: "1rem",
}));

const ImageSkeleton = styled(LoadingSkeleton)(({ theme }) => ({
  height: 400,
  width: 550,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "15px",
  [theme.breakpoints.down("xl")]: {
    width: 400,
    height: 350,
  },
  [theme.breakpoints.down("lg")]: {
    width: 380,
  },
  [theme.breakpoints.down("md")]: {
    width: 340,
  },
  [theme.breakpoints.down("sm")]: {
    width: 260,
  },
}));

const Image = styled(LazyImage)(() => ({
  flex: 1,
  objectFit: "fill",
  width: "100%",
}));

const TopRightContentWrapper = styled(Box)(({ theme }) => ({
  height: "100%",
  width: "100%",
  display: "grid",
  padding: "0.7rem 0rem",
  gridTemplateColumns: "repeat(3,1fr)",
  gap: "10px",
  [theme.breakpoints.down("xl")]: {
    gridTemplateColumns: "repeat(2,1fr)",
  },
}));

const TextWrapper = styled(Box)(() => ({
  width: "100%",
  height: 50,
  display: "flex",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));
const TextSkeleton = styled(LoadingSkeleton)(() => ({
  width: "100%",
  display: "flex",
  gap: "10px",
  height: "100%",
  alignItems: "center",
}));

const Label = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  color: theme.palette.text.secondary,
  [theme.breakpoints.down("xl")]: {
    fontSize: "0.85rem",
  },
}));

const Text = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  color: theme.palette.text.primary,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  [theme.breakpoints.down("xl")]: {
    fontSize: "0.85rem",
  },
}));

const AmenitiesWrapper = styled(Box)(() => ({
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  alignItems: "center",
  width: "100%",
}));
const AmenitiesCard = styled(Box)(({ theme }) => ({
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0.5rem",
  backgroundColor: theme.palette.background.default,
  minWidth: 100,
  borderRadius: "10px",
  border: `1px solid ${theme.palette.divider}`,
}));

const BottomHeader = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  borderBottom: `1px dashed ${theme.palette.divider}`,
  paddingBottom: "0.5rem",
}));

const RoomHeader = styled(Typography)(({ theme }) => ({
  fontSize: "2rem",
  color: theme.palette.text.primary,
  [theme.breakpoints.down("xl")]: {
    fontSize: "1.5rem",
  },
}));

const RoomCardWrapper = styled(Box)(() => ({
  display: "flex",
  width: "100%",
  alignItems: "center",
  marginTop: "0.7rem",
  flexWrap: "wrap",
  // flexShrink: "initial",
  gap: "10px",
}));
