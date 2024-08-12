import { Box, Stack, styled, Typography, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NextIcon, PreviousIcon } from "src/assets/iconify";
import Img from "src/assets/img/GujaratIMG.jpeg";
import LazyImage from "src/components/LazyImage";
import LoadingSkeleton from "src/components/Skeleton";
import useUserSearch from "src/hooks/useUserSearch";
import { Property } from "src/ObjMgr/Property";
import { Path } from "src/Router/path";
import showMessage from "src/util/ShowMessage";
import "swiper/css";
import "swiper/css/navigation";
import { A11y, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

type Props = {};

export default function ExploreCountryState({}: Props) {
  const { UserSearchObj, UpdateSearchObj } = useUserSearch();
  // Explore Country------------------------------------------------------------
  const ExploreCountrySwiperPrevButton = useRef<HTMLButtonElement>(null);
  const ExploreCountrySwiperNextButton = useRef<HTMLButtonElement>(null);
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [TotalPropertByCountryState, setTotalPropertByCountryState] = useState<
    { state: string; totalProperties: number }[]
  >([]);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    debugger;
    if (UserSearchObj.selectedCountry !== "") {
      if (TotalPropertByCountryState.length === 0) {
        loadTotalPropertByCountryState();
      }
    }
  }, [UserSearchObj]);

  const loadTotalPropertByCountryState = () => {
    setShowLoading(true);
    Property.GetTotalPropertByCountry(
      UserSearchObj.selectedCountry,
      (res) => {
        setTotalPropertByCountryState(res);
        setShowLoading(false);
      },
      (err) => {
        showMessage(err, "error", theme, () => {});
      }
    );
  };

  const OnClickProperty = (StateName: string) => {
    UpdateSearchObj("selectedState", StateName);
    navigate(
      Path.proprty.PropertyListByState(UserSearchObj.selectedCountry, StateName)
    );
  };

  return (
    <SwiperWrapper>
      {showLoading && (
        <SkeletonWrapper>
          {[0, 1, 2, 3, 4].map((_, _i) => (
            <LoadingSkeleton
              key={_i}
              isLoading={showLoading}
              height={"100%"}
              width={"100%"}
            >
              {null}
            </LoadingSkeleton>
          ))}
        </SkeletonWrapper>
      )}
      {!showLoading && (
        <Swiper
          modules={[Navigation, A11y]}
          spaceBetween={20}
          slidesPerView="auto"
          onSwiper={(swiper: any) => {
            if (
              ExploreCountrySwiperPrevButton.current &&
              ExploreCountrySwiperNextButton.current
            ) {
              swiper.params.navigation!.prevEl =
                ExploreCountrySwiperPrevButton.current;
              swiper.params.navigation!.nextEl =
                ExploreCountrySwiperNextButton.current;
              swiper.navigation.update();
            }
          }}
          style={{
            width: "100%",
          }}
          navigation={{
            prevEl: ExploreCountrySwiperPrevButton.current,
            nextEl: ExploreCountrySwiperNextButton.current,
          }}
        >
          {TotalPropertByCountryState.map((objProperty) => {
            return (
              <SwiperSlide
                style={{
                  height: "100%",
                  width: "250px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
                onClick={() => OnClickProperty(objProperty.state)}
              >
                <LazyImage
                  alt=""
                  src={Img}
                  style={{ width: "100%", height: "100%" }}
                />
                <Box>
                  <StateName>{objProperty.state.split("-")[0]}</StateName>
                  <TotalProperties>
                    {objProperty.totalProperties} Properties
                  </TotalProperties>
                </Box>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
      {!showLoading && (
        <Stack direction={"row"} gap={"10px"} justifyContent={"flex-end"}>
          <NextPrevSwiperWrapper ref={ExploreCountrySwiperPrevButton}>
            <PreviousIcon />
          </NextPrevSwiperWrapper>
          <NextPrevSwiperWrapper ref={ExploreCountrySwiperNextButton}>
            <NextIcon />
          </NextPrevSwiperWrapper>
        </Stack>
      )}
    </SwiperWrapper>
  );
}

// -----------------------------------------------  Trending--------------------------------------

const SwiperWrapper = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
}));

const SkeletonWrapper = styled(Box)(() => ({
  height: 250,
  width: "100%",
  display: "flex",
  gap: "20px",
  alignItems: "center",
}));

const StateName = styled(Typography)(({ theme }) => ({
  fontSize: "0.95rem",
  color: theme.palette.text.primary,
  textAlign: "left",
  marginTop: "auto",
}));

const TotalProperties = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  color: theme.palette.text.secondary,
  textAlign: "left",
  marginTop: "auto",
}));

const NextPrevSwiperWrapper = styled(Box)(({ theme }) => ({
  height: 30,
  width: 30,
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: theme.themeColor,
  padding: "0.5rem",
  zIndex: 20,
  cursor: "pointer",
}));
