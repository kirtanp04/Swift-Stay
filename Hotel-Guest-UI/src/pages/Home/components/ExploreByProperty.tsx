import { Box, Stack, styled, Typography, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { NextIcon, PreviousIcon } from "src/assets/iconify";
import Img from "src/assets/img/GujaratIMG.jpeg";
import LazyImage from "src/components/LazyImage";
import useUserSearch from "src/hooks/useUserSearch";
import { Property } from "src/ObjMgr/Property";
import showMessage from "src/util/ShowMessage";
import "swiper/css";
import "swiper/css/navigation";
import { A11y, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

type Props = {};

export default function ExploreByProperty({}: Props) {
  const { UserSearchObj } = useUserSearch();
  // Explore Country------------------------------------------------------------
  const ExploreCountrySwiperPrevButton = useRef<HTMLButtonElement>(null);
  const ExploreCountrySwiperNextButton = useRef<HTMLButtonElement>(null);
  const [TotalPropertByCountryState, setTotalPropertByCountryState] = useState<
    { propertyType: string; totalProperties: number }[]
  >([]);
  const theme = useTheme();

  useEffect(() => {
    if (UserSearchObj.selectedCountry !== "") {
      if (TotalPropertByCountryState.length === 0) {
        loadTotalPropertByPropertyType();
      }
    }
  }, [UserSearchObj]);

  const loadTotalPropertByPropertyType = () => {
    Property.GetTotalPropertByPropertyType(
      UserSearchObj.selectedCountry,
      (res) => {
        setTotalPropertByCountryState(res);
      },
      (err) => {
        showMessage(err, "error", theme, () => {});
      }
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
        {TotalPropertByCountryState.map((objProperty) => (
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
              <StateName>{objProperty.propertyType}</StateName>
              <TotalProperties>
                {objProperty.totalProperties} {objProperty.propertyType}
              </TotalProperties>
            </Box>
          </SwiperSlide>
        ))}
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
