import {
  Box,
  Chip,
  Divider,
  ImageList,
  ImageListItem,
  Rating,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { HeartIcon, LocationIcon, ShareIcon } from "src/assets/iconify";
import { getChipColor } from "src/common/common";
import Page from "src/components/Page";
import {
  enumPropertyType,
  Property,
  TPropertydetail,
} from "src/ObjMgr/Property";
import RoomDetail from "./RoomDetail";
import { useEffect, useState } from "react";
import showMessage from "src/util/ShowMessage";
import LazyImage from "src/components/LazyImage";
import LoadingSkeleton from "src/components/Skeleton";

export default function PropertyDetails() {
  const { propertyName, state, country, propertyID } = useParams();
  const [PropertDetail, setPropertyDetail] = useState<TPropertydetail>(
    new TPropertydetail()
  );
  const theme = useTheme();

  useEffect(() => {
    Property.GetSinglePropertyDetail(
      country!,
      state!,
      propertyName!,
      propertyID!,
      (res) => {
        setPropertyDetail(res);
      },
      (err) => {
        showMessage(err, "error", theme, () => {});
      }
    );
  }, []);
  return (
    <Page title={propertyName!}>
      <RootStyle>
        <StackSpaceBetween>
          <FlexWrapper isLoading={PropertDetail._id === ""}>
            <Rating
              name="size-medium"
              value={PropertDetail!.avgReview}
              precision={0.5}
              readOnly
            />

            <Chip
              label={PropertDetail!.propertyType}
              sx={{
                backgroundColor: getChipColor(
                  enumPropertyType.Apartment,
                  theme
                ),
                padding: "0.1rem 0.5rem",
              }}
            />
          </FlexWrapper>

          <FlexWrapper
            isLoading={PropertDetail._id === ""}
            justifyContent={"flex-end"}
          >
            <HeartIcon
              height={25}
              width={25}
              IconColor={theme.palette.color.rose.main}
              cursor={"pointer"}
            />

            <ShareIcon
              height={25}
              width={25}
              cursor={"pointer"}
              IconColor={theme.palette.color.info.main}
            />
          </FlexWrapper>
        </StackSpaceBetween>

        <StackSpaceBetween>
          <FlexWrapper isLoading={PropertDetail._id === ""}>
            <HeaderText sx={{ fontWeight: 700, fontSize: "2rem" }}>
              {PropertDetail!.name}
            </HeaderText>
          </FlexWrapper>
        </StackSpaceBetween>

        <FlexWrapper isLoading={PropertDetail._id === ""}>
          <SubTitle>
            <LocationIcon
              style={{ marginRight: "0.7rem" }}
              height={18}
              width={18}
            />
            {PropertDetail!.address} {" | "} {PropertDetail!.city}
          </SubTitle>
        </FlexWrapper>

        <FlexWrapper isLoading={PropertDetail._id === ""} sx={{ height: 450 }}>
          <ImageList
            sx={{ width: "100%", height: 450, padding: "0rem 0.5rem" }}
            variant="quilted"
            cols={6}
            rowHeight={121}
          >
            {PropertDetail!.images.map((item, i) => (
              <ImageListItem key={item}>
                <LazyImage src={item} alt={`Image ${i}`} loading="lazy" />
              </ImageListItem>
            ))}
          </ImageList>
        </FlexWrapper>

        <FlexWrapper isLoading={PropertDetail._id === ""}>
          <SubTitle>{PropertDetail!.description}</SubTitle>
        </FlexWrapper>

        <Box marginTop={"1.2rem"}>
          <FlexWrapper isLoading={PropertDetail._id === ""}>
            <SubTitleHeader>Most popular facilities</SubTitleHeader>
          </FlexWrapper>
          <FlexWrapper
            isLoading={PropertDetail._id === ""}
            sx={{ flexWrap: "wrap", width: "60%", marginTop: "1.5rem" }}
          >
            {PropertDetail!.amenities.map((amen) => (
              <SubTitle
                sx={{
                  padding: "0.2rem 0.5rem",
                  backgroundColor: theme.palette.background.neutral,
                  border: theme.palette.border,
                  borderRadius: "4px",
                }}
                key={amen}
              >
                {amen}
              </SubTitle>
            ))}
          </FlexWrapper>
        </Box>

        <Divider sx={{ margin: "2rem 0rem" }} flexItem />

        <Box>
          <FlexWrapper isLoading={PropertDetail._id === ""}>
            <HeaderText sx={{ fontSize: "2rem", fontWeight: 600 }}>
              Availability
            </HeaderText>
          </FlexWrapper>
          <FlexWrapper isLoading={PropertDetail._id === ""}>
            <RoomDetail Rooms={PropertDetail!.rooms} />
          </FlexWrapper>
        </Box>
      </RootStyle>
    </Page>
  );
}

const RootStyle = styled(Box)(() => ({
  minHeight: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
}));

const StackSpaceBetween = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));

const FlexWrapper = styled(LoadingSkeleton)(() => ({
  display: "flex",
  alignItems: "center",
  margin: 0,
  gap: "10px",
  width: "100%",
}));

const HeaderText = styled(Typography)(({ theme }) => ({
  fontSize: "1.2rem",
  color: theme.palette.text.primary,
  textAlign: "start",
  display: "flex",
  alignItems: "center",
}));

const SubTitleHeader = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  color: theme.palette.text.primary,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "flex",
  alignItems: "center",
  fontWeight: 700,
}));

const SubTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  color: theme.palette.text.primary,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "flex",
  alignItems: "center",
}));

// const Text = styled(Typography)(({ theme }) => ({
//   fontSize: "0.8rem",
//   color: theme.palette.text.secondary,
//   whiteSpace: "nowrap",
//   overflow: "hidden",
//   textOverflow: "ellipsis",
//   display: "flex",
//   alignItems: "center",
// }));
