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

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { HeartIcon, LocationIcon, ShareIcon } from "src/assets/iconify";
import { getChipColor, GetCountryByCode } from "src/common/common";
import LazyImage from "src/components/LazyImage";
import Page from "src/components/Page";
import LoadingSkeleton from "src/components/Skeleton";
import {
  enumPropertyType,
  Property,
  TPropertydetail,
} from "src/ObjMgr/Property";
import showMessage from "src/util/ShowMessage";
import RoomDetail from "./RoomDetail";
import Reviewlist from "./Reviewlist";
import { Storage } from "src/common/Storage";

export default function PropertyDetails() {
  const { propertyName, state, country, propertyID } = useParams();
  const [PropertDetail, setPropertyDetail] = useState<TPropertydetail>(
    new TPropertydetail()
  );
  const [CountryCurrency, setCountryCurrency] = useState<string>("");
  const [WishlistIDS, setWishlistId] = useState<string[]>([]);
  const theme = useTheme();

  useEffect(() => {
    Property.GetSinglePropertyDetail(
      country!,
      state!,
      propertyName!,
      propertyID!,
      (res: TPropertydetail) => {
        setPropertyDetail(res);
        getCountrybyCode(res.propertyDetails.country);
      },
      (err) => {
        showMessage(err, "error", theme, () => {});
      }
    );
  }, []);

  useEffect(() => {
    const propertyIDs = Storage.getFromSessionStorage("Wishlist");

    if (propertyIDs.error === "") {
      const propertIDS: string[] = [...propertyIDs.data];

      setWishlistId(propertIDS);
    }
  }, []);

  const getCountrybyCode = async (pCountry: string) => {
    try {
      const countryObj = await GetCountryByCode(
        pCountry.split("-")[1] as string
      );
      setCountryCurrency(countryObj.currency);
    } catch (error: any) {
      showMessage(error, "error", theme, () => {});
    }
  };

  const SaveToWishlist = (pPropertyID: string) => {
    const propertyIDs = Storage.getFromSessionStorage("Wishlist");

    if (propertyIDs.error === "") {
      const propertIDS: string[] = [...propertyIDs.data];
      if (!propertIDS.includes(pPropertyID)) {
        propertIDS.push(pPropertyID);
        Storage.setToSessionStorage("Wishlist", propertIDS);
        setWishlistId([...WishlistIDS, pPropertyID]);
      } else {
        const updated = propertIDS.filter((ids) => ids !== pPropertyID);
        Storage.setToSessionStorage("Wishlist", updated);
        setWishlistId(updated);
      }
    } else {
      const propertIDS: string[] = [];
      propertIDS.push(pPropertyID);
      Storage.setToSessionStorage("Wishlist", propertIDS);
      setWishlistId([pPropertyID]);
    }
  };

  return (
    <Page title={propertyName!}>
      <RootStyle>
        <StackSpaceBetween>
          <FlexWrapper isLoading={PropertDetail.propertyID === ""}>
            <Rating
              name="size-medium"
              value={PropertDetail!.avgReview}
              precision={0.5}
              readOnly
            />

            <Chip
              label={PropertDetail!.propertyDetails.propertyType}
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
            isLoading={PropertDetail.propertyID === ""}
            justifyContent={"flex-end"}
          >
            <HeartIcon
              height={25}
              width={25}
              IconColor={theme.palette.color.rose.main}
              cursor={"pointer"}
              onClick={() => SaveToWishlist(PropertDetail.propertyID)}
              isWishlist={WishlistIDS.includes(PropertDetail.propertyID)}
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
          <FlexWrapper isLoading={PropertDetail.propertyID === ""}>
            <HeaderText sx={{ fontWeight: 700, fontSize: "2rem" }}>
              {PropertDetail!.propertyDetails.name}
            </HeaderText>
          </FlexWrapper>
        </StackSpaceBetween>

        <FlexWrapper isLoading={PropertDetail.propertyID === ""}>
          <SubTitle>
            <LocationIcon
              style={{ marginRight: "0.7rem" }}
              height={18}
              width={18}
            />
            {PropertDetail!.propertyDetails.address} {" | "}{" "}
            {PropertDetail!.propertyDetails.city}
          </SubTitle>
        </FlexWrapper>

        <FlexWrapper
          isLoading={PropertDetail.propertyID === ""}
          sx={{ height: 450 }}
        >
          <ImageList
            sx={{ width: "100%", height: 450, padding: "0rem 0.5rem" }}
            variant="quilted"
            cols={3}
            rowHeight={250}
          >
            {PropertDetail!.propertyDetails.images.map((item, i) => (
              <ImageListItem key={item}>
                <LazyImage src={item} alt={`Image ${i}`} />
              </ImageListItem>
            ))}
          </ImageList>
        </FlexWrapper>

        <FlexWrapper isLoading={PropertDetail.propertyID === ""}>
          <SubTitle>{PropertDetail!.propertyDetails.description}</SubTitle>
        </FlexWrapper>

        <Box marginTop={"1.2rem"}>
          <FlexWrapper isLoading={PropertDetail.propertyID === ""}>
            <SubTitleHeader>Most popular facilities</SubTitleHeader>
          </FlexWrapper>
          <FlexWrapper
            isLoading={PropertDetail.propertyID === ""}
            sx={{ flexWrap: "wrap", width: "60%", marginTop: "1.5rem" }}
          >
            {PropertDetail!.propertyDetails.amenities.map((amen) => (
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

        {/* --------------------------------------------------- Room Details--------- */}
        <Box>
          <FlexWrapper isLoading={PropertDetail.propertyID === ""}>
            <StackSpaceBetween>
              <HeaderText sx={{ fontSize: "2rem", fontWeight: 600 }}>
                Availability
              </HeaderText>

              <AnyQuestionBtn>Any Questions ?</AnyQuestionBtn>
            </StackSpaceBetween>
          </FlexWrapper>
          <FlexWrapper isLoading={PropertDetail.propertyID === ""}>
            <RoomDetail
              Rooms={PropertDetail!.Rooms}
              currency={CountryCurrency}
            />
          </FlexWrapper>
        </Box>

        <Divider sx={{ margin: "2rem 0rem" }} flexItem />
        {/* --------------------------------------------------- Review Details--------- */}
        {PropertDetail.review !== null && (
          <Box>
            <FlexWrapper isLoading={PropertDetail.propertyID === ""}>
              <HeaderText sx={{ fontSize: "2rem", fontWeight: 600 }}>
                Guest reviews
              </HeaderText>
            </FlexWrapper>
            <FlexWrapper isLoading={PropertDetail.propertyID === ""}>
              <Reviewlist
                avgReview={PropertDetail.avgReview}
                review={PropertDetail.review}
              />
            </FlexWrapper>
          </Box>
        )}
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

const AnyQuestionBtn = styled(Box)(({ theme }) => ({
  padding: "0.3rem 0.7rem",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1rem",
  color: theme.palette.background.default,
  backgroundColor: theme.palette.color.warning.main,
  cursor: "pointer",
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
