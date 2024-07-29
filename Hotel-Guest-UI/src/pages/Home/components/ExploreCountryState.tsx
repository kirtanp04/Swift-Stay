import { Box, Stack, styled, Typography } from "@mui/material";
import { useRef } from "react";
import { NextIcon, PreviousIcon } from "src/assets/iconify";
import Img from "src/assets/img/GujaratIMG.jpeg";
import LazyImage from "src/components/LazyImage";
import "swiper/css";
import "swiper/css/navigation";
import { A11y, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

type Props = {};

export default function ExploreCountryState({}: Props) {
  // Explore Country------------------------------------------------------------
  const ExploreCountrySwiperPrevButton = useRef<HTMLButtonElement>(null);
  const ExploreCountrySwiperNextButton = useRef<HTMLButtonElement>(null);

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
        <SwiperSlide
          style={{
            height: "100%",
            width: "250px",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <LazyImage
            alt=""
            src={Img}
            style={{ width: "100%", height: "100%" }}
          />
          <Box>
            <StateName>Gujarat</StateName>
            <TotalProperties>445 properties</TotalProperties>
          </Box>
        </SwiperSlide>
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
