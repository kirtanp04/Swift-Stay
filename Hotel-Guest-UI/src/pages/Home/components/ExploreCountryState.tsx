import { Box, Stack, styled, Typography } from "@mui/material";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { NextIcon, PreviousIcon } from "src/assets/iconify";
import Img from "src/assets/img/GujaratIMG.jpeg";
import LazyImage from "src/components/LazyImage";
import useUserSearch from "src/hooks/useUserSearch";
import { Path } from "src/Router/path";
import "swiper/css";
import "swiper/css/navigation";
import { A11y, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

type Props = {
  TotalPropertByCountryState: { state: string; totalProperties: number }[];
};

export default function ExploreCountryState({
  TotalPropertByCountryState,
}: Props) {
  const { UserSearchObj, UpdateSearchObj } = useUserSearch();
  // Explore Country------------------------------------------------------------
  const ExploreCountrySwiperPrevButton = useRef<HTMLButtonElement>(null);
  const ExploreCountrySwiperNextButton = useRef<HTMLButtonElement>(null);

  const navigate = useNavigate();

  const OnClickProperty = (StateName: string) => {
    UpdateSearchObj("selectedState", StateName);
    navigate(
      Path.proprty.PropertyListByState(UserSearchObj.selectedCountry, StateName)
    );
  };

  return (
    <SwiperWrapper>
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

      <Stack direction={"row"} gap={"10px"} justifyContent={"flex-end"}>
        <NextPrevSwiperWrapper ref={ExploreCountrySwiperPrevButton}>
          <PreviousIcon />
        </NextPrevSwiperWrapper>
        <NextPrevSwiperWrapper ref={ExploreCountrySwiperNextButton}>
          <NextIcon />
        </NextPrevSwiperWrapper>
      </Stack>
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
