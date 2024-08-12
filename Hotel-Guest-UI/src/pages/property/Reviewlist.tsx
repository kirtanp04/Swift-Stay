import {
  Box,
  Rating,
  Stack,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import "swiper/css";
import "swiper/css/navigation";
import { A11y, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { getReviewRatingInWord } from "src/common/common";
import { Review } from "src/ObjMgr/Review";
import { useRef } from "react";
import { NextIcon, PreviousIcon } from "src/assets/iconify";
import DateFormatter from "src/common/DateFormate";

type Props = {
  review: Review;
  avgReview: number;
};

export default function Reviewlist({ avgReview, review }: Props) {
  const ExploreCountrySwiperPrevButton = useRef<HTMLButtonElement>(null);
  const ExploreCountrySwiperNextButton = useRef<HTMLButtonElement>(null);
  const theme = useTheme();
  const DateFormate = DateFormatter.getInstance();

  return (
    <RootStyle>
      <FlexWrapper>
        <AvgReview>
          {" "}
          {Math.round(avgReview * 10) / 10}
          {/* {avgReview} */}
        </AvgReview>
        <SubTitle>{getReviewRatingInWord(avgReview)}</SubTitle>
        <Text>{review.reviewInfo.length} Reviews</Text>
      </FlexWrapper>

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
          {review.reviewInfo.map((objReview) => (
            <SwiperSlide
              style={{
                height: "100%",
                minWidth: 300,
                maxWidth: 350,
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                border: `1px solid ${theme.palette.border}`,
                minHeight: 200,
                padding: "1rem",
                borderRadius: "10px",
              }}
            >
              <ReviewText>{objReview.message}</ReviewText>
              <TotalProperties>
                <Rating
                  name="size-medium"
                  value={objReview.rating}
                  precision={0.5}
                  readOnly
                />
                <Text sx={{ marginLeft: "auto" }}>
                  {DateFormate.formatToDDMMYYYY(objReview.createAt)}
                </Text>
              </TotalProperties>
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
    </RootStyle>
  );
}

const RootStyle = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  width: "100%",
  marginTop: "1.2rem",
  flexDirection: "column",
}));

const FlexWrapper = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  margin: 0,
  gap: "10px",
  width: "100%",
}));

const AvgReview = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  fontSize: "0.9rem",
  justifyContent: "center",
  borderRadius: "10px",
  backgroundColor: theme.palette.color.info.darker,
  color: theme.palette.background.default,
  height: 35,
  width: 35,
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

const Text = styled(Typography)(({ theme }) => ({
  fontSize: "0.8rem",
  color: theme.palette.text.secondary,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "flex",
  alignItems: "center",
}));

const ReviewText = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  color: theme.palette.text.primary,
  display: "flex",
  alignItems: "center",
  width: "100%",
  textWrap: "wrap",
}));

const SwiperWrapper = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  marginTop: "1rem",
}));

// const StateName = styled(Typography)(({ theme }) => ({
//   fontSize: "0.95rem",
//   color: theme.palette.text.primary,
//   textAlign: "left",
//   marginTop: "auto",
// }));

const TotalProperties = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  color: theme.palette.text.secondary,
  textAlign: "left",
  marginTop: "auto",
  display: "flex",
  alignItems: "center",
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
