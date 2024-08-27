import { Box, Chip, styled, useTheme } from "@mui/material";
import {
  FlexWrapper,
  LoadingFlexWrapper,
  MUIDivider,
  StackSpaceBetween,
  SubTitle,
  Text,
} from "./CommonStyle";
import { Room } from "src/ObjMgr/Room";
import { createArray, getChipColor } from "../property/RoomDetail";
import { PersonIcon } from "src/assets/iconify";

type Props = {
  RoomDetail: Room;
};

export default function RoomDetails({ RoomDetail }: Props) {
  const theme = useTheme();
  return (
    <Rootstyle>
      <StackSpaceBetween>
        <SubTitle sx={{ fontSize: "1.5rem" }}>Room Detail</SubTitle>

        <Chip
          label={RoomDetail.type}
          color={getChipColor(RoomDetail.type) as any}
          variant="filled"
        />
      </StackSpaceBetween>

      <MUIDivider sx={{ margin: "0.5rem 0rem" }} />

      <LoadingFlexWrapper
        isLoading={RoomDetail._id === ""}
        sx={{ flexWrap: "wrap" }}
      >
        <FlexWrapper>
          <SubTitle>Room no :</SubTitle>

          <SubTitle
            sx={{ color: theme.palette.color.warning.main, fontWeight: 500 }}
          >
            {RoomDetail.roomNumber}
          </SubTitle>
        </FlexWrapper>
      </LoadingFlexWrapper>

      <LoadingFlexWrapper
        isLoading={RoomDetail._id === ""}
        sx={{ flexWrap: "wrap" }}
      >
        <FlexWrapper>
          <SubTitle>Description :</SubTitle>
          <Text>{RoomDetail.description}</Text>
        </FlexWrapper>
      </LoadingFlexWrapper>

      <LoadingFlexWrapper
        isLoading={RoomDetail._id === ""}
        sx={{ flexWrap: "wrap" }}
      >
        <FlexWrapper>
          <SubTitle>Amenities :</SubTitle>
          {RoomDetail.amenities.map((amen) => (
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
        </FlexWrapper>
      </LoadingFlexWrapper>

      <LoadingFlexWrapper
        isLoading={RoomDetail._id === ""}
        sx={{ flexWrap: "wrap" }}
      >
        <SubTitle>Total Guests :</SubTitle>
        {createArray(RoomDetail.maxOccupancy).map((_, i) => (
          <PersonIcon height={18} width={18} key={i} />
        ))}
      </LoadingFlexWrapper>
    </Rootstyle>
  );
}

const Rootstyle = styled(Box)(() => ({
  height: "100%",
  width: "100%",
  display: "flex",
  gap: "12px",
  flexDirection: "column",
}));
