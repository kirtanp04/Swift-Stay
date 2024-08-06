import { Box, Button, Typography, styled, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { RESIconButton } from "src/components/RESIconButton";
import { DeleteIcon, EditIcon, PlusIcon, UpdateIcon } from "src/assets/iconify";
import AddPropertyDialog from "./AddPropertyDialog";
import { Path } from "src/Router/path";
import { RoomClass } from "../room/DataObject";
import AddRoomDialog from "../room/AddRoomDialog";

type Props = {};

export default function PropertyViewer({}: Props) {
  const [Property, setProperty] = useState<PropertyClass>(new PropertyClass());
  const [showUpdatePropertyDialog, setShowUpdatePropertyDialog] =
    useState<boolean>(false);
  const [showAddRoomDialog, setShowAddRoomDialog] = useState<boolean>(false);
  const [objRoom, setObjRoom] = useState<RoomClass>(new RoomClass());
  const theme = useTheme();
  const navigate = useNavigate();
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

  const openUpdatePropertyDialog = () => {
    setShowUpdatePropertyDialog(true);
  };

  const closeUpdatePropertyDialog = () => {
    setShowUpdatePropertyDialog(false);
  };

  const openAddRoomDialog = () => {
    let _objNewRoom = new RoomClass();
    _objNewRoom.property = Property;
    _objNewRoom.adminID = id;
    setObjRoom(_objNewRoom);
    setShowAddRoomDialog(true);
  };

  const closeAddRoomDialog = () => {
    setShowAddRoomDialog(false);
  };

  const DeleteProperty = () => {
    showLoading(theme, true);
    PropertyApi.deleteProperty(
      id,
      Property._id,
      (res) => {
        showLoading(theme, false);
        navigate(Path.property.root);
        if (res) {
        }
      },
      (err) => {
        showLoading(theme, false);
        showMessage(err, theme, () => {});
      }
    );
  };

  const afterDeleteRoom = (RoomID: string) => {
    const _updatedRoom = Property.rooms.filter(
      (objRoom) => objRoom._id !== RoomID
    );
    setProperty({ ...Property, rooms: _updatedRoom });
  };

  const afterUpdateProperty = (objProperty: PropertyClass | undefined) => {
    setProperty(objProperty!);
  };

  const afterCreatingRoom = (objRoom: RoomClass | undefined) => {
    let _objNewProperty = Property;
    _objNewProperty.rooms.push(objRoom!);
    setProperty(_objNewProperty);
  };

  return (
    <Page title={Property.name}>
      <RootStyle>
        <HeaderWrapper>
          <LoadingSkeleton
            isLoading={Property._id !== "" ? false : true}
            sx={{
              width: "100%",
              height: "100%",
              justifyContent: "space-between",
              display: "flex",
            }}
            variant="text"
          >
            <HeaderHotelName>{Property.name}</HeaderHotelName>

            <HeaderHotelAction>
              <RESIconButton
                iconposition="start"
                starticon={<EditIcon />}
                variant="outlined"
                onClick={openUpdatePropertyDialog}
              >
                Edit
              </RESIconButton>
              <RESIconButton
                iconposition="start"
                starticon={<DeleteIcon />}
                variant="contained"
                onClick={DeleteProperty}
              >
                Delete
              </RESIconButton>
            </HeaderHotelAction>
          </LoadingSkeleton>
        </HeaderWrapper>
        <EScrollbar>
          <ContentWrapper>
            {/* ---------------------------- top Text Content-------------------------------------- */}
            <TopContentWrapper>
              <ImageWrapper>
                <ImageSkeleton
                  isLoading={Property.images.length > 0 ? false : true}
                  variant="rectangular"
                >
                  <Image src={Property.images[0]} alt="Hotel pic" />
                </ImageSkeleton>
              </ImageWrapper>

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
                        variant="filled"
                        size="small"
                        sx={{
                          width: 120,
                          backgroundColor: getChipColor(
                            Property.propertyType,
                            theme
                          ) as any,
                        }}
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
                      <Label>Job Availability :</Label>
                      <Text
                        sx={{
                          color: Property.jobHiring
                            ? (theme.palette.color.success as any)
                            : (theme.palette.color.error.main as any),
                        }}
                      >
                        {Property.jobHiring ? "A" : "N"}
                      </Text>
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
                </TopRightContentWrapper>

                <TextWrapper>
                  <TextSkeleton isLoading={Property._id !== "" ? false : true}>
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
              </Scrollbar>
            </TopContentWrapper>

            {/* ----------------------------BottomWrapper Room Data -------------------------------------- */}

            <BottomWrapper>
              <LoadingSkeleton
                isLoading={Property._id === "" ? true : false}
                sx={{ width: "100%" }}
              >
                <BottomHeader>
                  <RoomHeader>Rooms</RoomHeader>
                </BottomHeader>
              </LoadingSkeleton>

              {Property.rooms.length > 0 ? (
                <RoomCardWrapper>
                  {Property.rooms.map((objRoom) => (
                    <RoomCard
                      afterDeleteRoom={afterDeleteRoom}
                      key={objRoom._id}
                      objRoom={objRoom}
                    />
                  ))}
                </RoomCardWrapper>
              ) : (
                <LoadingSkeleton
                  isLoading={Property._id === "" ? true : false}
                  sx={{ height: "100%", width: "100%" }}
                >
                  <NowRooWrapper>
                    <Typography fontSize={"0.9rem"}>No rooms </Typography>
                    <Button
                      startIcon={<PlusIcon />}
                      variant="outlined"
                      onClick={openAddRoomDialog}
                    >
                      Create new Room
                    </Button>
                  </NowRooWrapper>
                </LoadingSkeleton>
              )}
            </BottomWrapper>
          </ContentWrapper>
        </EScrollbar>
      </RootStyle>

      {showUpdatePropertyDialog && (
        <AddPropertyDialog
          objProperty={Property}
          onClose={closeUpdatePropertyDialog}
          afterSave={afterUpdateProperty}
        />
      )}

      {showAddRoomDialog && (
        <AddRoomDialog
          objRoom={objRoom}
          onClose={closeAddRoomDialog}
          afterSave={afterCreatingRoom}
        />
      )}
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
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: "0.7rem",

  paddingRight: "1rem",
}));

const HeaderHotelName = styled(Typography)(({ theme }) => ({
  fontSize: "2rem",
  color: theme.palette.text.primary,
  fontFamily: "Heading",
}));

const HeaderHotelAction = styled(Typography)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "15px",
}));

const EScrollbar = styled(Scrollbar)(() => ({
  height: "100%",
  width: "100%",
}));

const ContentWrapper = styled(Box)(() => ({
  height: "100%",
  width: "100%",
  // border: `1px dashed ${theme.palette.divider}`,
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

const ImageWrapper = styled(Box)(({ theme }) => ({
  height: 300,
  width: 450,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "15px",
  [theme.breakpoints.down("xl")]: {
    width: 350,
    height: 350,
  },
  [theme.breakpoints.down("lg")]: {
    width: "100%",
    height: 300,
  },
  [theme.breakpoints.down("md")]: {
    height: 250,
  },
  // [theme.breakpoints.down("sm")]: {
  //   width: 260,
  //   height: 350,
  // },
}));

const ImageSkeleton = styled(LoadingSkeleton)(() => ({
  height: "100%",
  width: "100%",
}));

const Image = styled(LazyImage)(() => ({
  height: "100%",
  objectFit: "fill",
  width: "100%",
}));

const TopRightContentWrapper = styled(Box)(({ theme }) => ({
  height: "100%",
  width: "100%",
  display: "grid",
  // padding: "0.7rem 0rem",
  gridTemplateColumns: "repeat(2,1fr)",
  // gap: "2px",
  [theme.breakpoints.down("xl")]: {
    gridTemplateColumns: "repeat(2,1fr)",
  },
  [theme.breakpoints.down("lg")]: {
    gridTemplateColumns: "repeat(1,1fr)",
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
  fontSize: "0.85rem",
  color: theme.palette.text.secondary,
  [theme.breakpoints.down("xl")]: {
    fontSize: "0.85rem",
  },
  width: "7rem",
  textAlign: "end",
}));

const Text = styled(Typography)(({ theme }) => ({
  fontSize: "0.85rem",
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
  padding: "0.1rem",
  backgroundColor: theme.palette.background.neutral,
  minWidth: 100,
  borderRadius: "10px",
  border: `1px solid ${theme.palette.text.disabled}`,
}));

const BottomHeader = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  borderBottom: `1px solid ${theme.palette.divider}`,
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

const NowRooWrapper = styled(Box)(() => ({
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "3rem",
  gap: "20px",
}));
