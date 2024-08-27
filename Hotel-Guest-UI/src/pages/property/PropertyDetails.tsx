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
import { Storage } from "src/common/Storage";
import EToolTip from "src/components/EToolTip";
import IfLogedin from "src/components/IfLogedin";
import LazyImage from "src/components/LazyImage";
import LoginPopOver from "src/components/LoginPopOver";
import Page from "src/components/Page";
import LoadingSkeleton from "src/components/Skeleton";
import useAuth from "src/hooks/useAuth";
import { Property, TPropertydetail } from "src/ObjMgr/Property";
import showMessage from "src/util/ShowMessage";
import Chat from "../Chat/Chat";
import Reviewlist from "./Reviewlist";
import RoomDetail from "./RoomDetail";

export default function PropertyDetails() {
  const { propertyName, state, country, propertyID } = useParams();
  const {
    user: {
      userInfo: { email },
    },
  } = useAuth();
  const [PropertDetail, setPropertyDetail] = useState<TPropertydetail>(
    new TPropertydetail()
  );
  const [CountryCurrency, setCountryCurrency] = useState<string>("");
  const [WishlistIDS, setWishlistId] = useState<string[]>([]);
  const [AmISubscriber, setAmISubscriber] = useState<boolean>(false);
  const [openChat, setOpenChat] = useState<boolean>(false);
  const theme = useTheme();

  useEffect(() => {
    Property.GetSinglePropertyDetail(
      country!,
      state!,
      propertyName!,
      propertyID!,
      (res: TPropertydetail) => {
        setPropertyDetail(res);
        if (res.subscribers.map((obj) => obj.email === email)) {
          setAmISubscriber(true);
        }
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
                  PropertDetail!.propertyDetails.propertyType,
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

        <StackSpaceBetween>
          <FlexWrapper
            isLoading={PropertDetail.propertyID === ""}
            flex={1}
            sx={{ alignItems: "flex-start" }}
          >
            <SubTitle>{PropertDetail!.propertyDetails.description}</SubTitle>
          </FlexWrapper>
          <FlexWrapper
            isLoading={PropertDetail.propertyID === ""}
            sx={{ width: 200, padding: "0rem 1rem", alignItems: "flex-start" }}
          >
            <IfLogedin
              Else={
                <>
                  <EToolTip
                    title={
                      <LoginPopOver
                        text={`You are not authorize. Please login to Swift Stay to Subscribe this Property`}
                      />
                    }
                  >
                    <SubscribeButton>Subscribe</SubscribeButton>
                  </EToolTip>
                </>
              }
            >
              {AmISubscriber ? (
                <SubscribeButton>Un Subscribe</SubscribeButton>
              ) : (
                <SubscribeButton>Subscribe</SubscribeButton>
              )}
            </IfLogedin>
          </FlexWrapper>
        </StackSpaceBetween>

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

              <IfLogedin
                Else={
                  <>
                    <EToolTip
                      title={
                        <LoginPopOver
                          text={`You are not authorize. Please login to Swift Stay to have a chat with the admin`}
                        />
                      }
                    >
                      <AnyQuestionBtn>Any Questions ?</AnyQuestionBtn>
                    </EToolTip>
                  </>
                }
              >
                <AnyQuestionBtn onClick={() => setOpenChat(true)}>
                  Any Questions ?
                </AnyQuestionBtn>
              </IfLogedin>
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

        {/* --------------------------------------- Chat--------------------------------- */}
        {openChat && (
          <Chat
            onClose={() => setOpenChat(false)}
            open={openChat}
            property={PropertDetail.propertyDetails}
            propertyID={PropertDetail.propertyID}
          />
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

const SubscribeButton = styled(Box)(({ theme }) => ({
  padding: "0.3rem 0.8rem",
  borderRadius: "10px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.color.rose.main,
  color: theme.palette.background.default,
  width: "100%",
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
