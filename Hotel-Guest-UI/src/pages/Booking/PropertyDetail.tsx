import { Box, Chip, Rating, styled, useTheme } from "@mui/material";
import { TPropertydetail } from "src/ObjMgr/Property";
import { LoadingFlexWrapper, MUIDivider, SubTitle, Text } from "./CommonStyle";
import { getChipColor, getReviewRatingInWord } from "src/common/common";

type Props = {
  Property: TPropertydetail;
};

export default function PropertyDetail({ Property }: Props) {
  const theme = useTheme();
  return (
    <Rootstyle>
      <SubTitle>Property</SubTitle>
      <MUIDivider sx={{ margin: "0.2rem 0rem 0.5rem 0rem" }} />

      <LoadingFlexWrapper isLoading={Property.propertyID === ""}>
        <Chip
          label={Property.propertyDetails.propertyType}
          sx={{
            backgroundColor: getChipColor(
              Property.propertyDetails.propertyType,
              theme
            ),
            padding: "0.1rem 0.5rem",
            color: theme.palette.background.default,
          }}
        />

        <Rating
          name="size-medium"
          value={Property.avgReview}
          precision={0.5}
          readOnly
          sx={{
            "& .MuiSvgIcon-root": {
              fontSize: "1rem",
            },
          }}
        />
      </LoadingFlexWrapper>

      <LoadingFlexWrapper isLoading={Property.propertyID === ""}>
        <SubTitle>{Property.propertyDetails.name}</SubTitle>
      </LoadingFlexWrapper>

      <LoadingFlexWrapper isLoading={Property.propertyID === ""}>
        <Text>{Property.propertyDetails.address}</Text>
      </LoadingFlexWrapper>

      <LoadingFlexWrapper isLoading={Property.propertyID === ""}>
        {Property.avgReview !== 0 && (
          <ReviewScore>
            <Text
              sx={{
                color: `${theme.palette.background.default} !important`,
              }}
            >
              {Math.round(Property.avgReview * 10) / 10}
            </Text>
          </ReviewScore>
        )}

        {Property.avgReview !== 0 && (
          <Text>
            {getReviewRatingInWord(Math.round(Property.avgReview * 10) / 10)}
          </Text>
        )}

        <Text>{Property.review?.reviewInfo.length} reviews</Text>
      </LoadingFlexWrapper>

      <LoadingFlexWrapper
        isLoading={Property.propertyID === ""}
        sx={{ flexWrap: "wrap" }}
      >
        {Property!.propertyDetails.amenities.map((amen) => (
          <Text
            sx={{
              padding: "0.2rem 0.5rem",
              backgroundColor: theme.palette.background.neutral,
              border: theme.palette.border,
              borderRadius: "4px",
            }}
            key={amen}
          >
            {amen}
          </Text>
        ))}
      </LoadingFlexWrapper>
    </Rootstyle>
  );
}

const Rootstyle = styled(Box)(({ theme }) => ({
  height: "auto",
  width: "100%",
  display: "flex",
  gap: "5px",
  flexDirection: "column",
  border: `1px solid ${theme.palette.border}`,
  padding: "1rem",
  borderRadius: "10px",
}));

const ReviewScore = styled(Box)(({ theme }) => ({
  height: 25,
  width: 25,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "5px",
  backgroundColor: theme.palette.color.info.darker,
}));
