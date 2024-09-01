import { Box, styled } from "@mui/material";
import DateFormatter from "src/common/DateFormate";
import useUserSearch from "src/hooks/useUserSearch";
import { Room } from "src/ObjMgr/Room";
import {
  FlexWrapper,
  MUIDivider,
  StackSpaceBetween,
  SubTitle,
  Text,
} from "./CommonStyle";

type Props = {
  RoomDetail: Room;
};

export default function PriceSummary({ RoomDetail }: Props) {
  const {
    UserSearchObj: { checkInDate, checkOutDate },
  } = useUserSearch();
  return (
    <Rootstyle>
      <FlexWrapper sx={{ padding: "1rem 1rem 0rem 1rem" }}>
        <SubTitle>Your price summary</SubTitle>
      </FlexWrapper>
      <MUIDivider sx={{ margin: "0.2rem 1rem 0.5rem 1rem" }} />

      <StackSpaceBetween sx={{ padding: "0rem 1rem" }}>
        <Text>Original price</Text>
        <Text sx={{ fontWeight: 550 }}>
          {RoomDetail.currency} {RoomDetail.price} for 1 night
        </Text>
      </StackSpaceBetween>

      <StackSpaceBetween sx={{ padding: "0rem 1rem" }}>
        <Text>Base on number of stay</Text>
        <Text sx={{ fontWeight: 550 }}>
          <span>x</span>{" "}
          {DateFormatter.getInstance().getDifferenceInDays(
            checkInDate!,
            checkOutDate!
          )}
        </Text>
      </StackSpaceBetween>

      <TotalPriceWrapper>
        <SubTitle>Total Price</SubTitle>
        <Box>
          <SubTitle>
            {RoomDetail.currency}{" "}
            {RoomDetail.price *
              DateFormatter.getInstance().getDifferenceInDays(
                checkInDate!,
                checkOutDate!
              )}
          </SubTitle>
        </Box>
      </TotalPriceWrapper>
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
  borderRadius: "10px",
  overflow: "hidden",
}));

const TotalPriceWrapper = styled(StackSpaceBetween)(({ theme }) => ({
  backgroundColor: theme.palette.color.rose.lighter,
  padding: "0.5rem 1rem",
  marginTop: "0.5rem",
  // justifyContent: "center",
}));
