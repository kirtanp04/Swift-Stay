import { Box, styled, useTheme } from "@mui/material";
import DateFormatter from "src/common/DateFormate";
import useUserSearch from "src/hooks/useUserSearch";
import { FlexWrapper, MUIDivider, SubTitle, Text } from "./CommonStyle";
import { EditIcon } from "src/assets/iconify";

type Props = {};

const labelWidth = "4rem";

export default function BookinDetail({}: Props) {
  const theme = useTheme();
  const {
    UserSearchObj: { adults, checkInDate, checkOutDate, children },
  } = useUserSearch();
  return (
    <Rootstyle>
      <FlexWrapper sx={{ justifyContent: "space-between" }}>
        <SubTitle>Your booking details</SubTitle>
        <EditIcon cursor={"pointer"} />
      </FlexWrapper>

      <MUIDivider sx={{ margin: "0.2rem 0rem 0.5rem 0rem" }} />

      <FlexWrapper>
        <Text sx={{ width: labelWidth }}>Check-in</Text>
        <Text>-</Text>
        <Text>
          {DateFormatter.getInstance().formatToDDMMYYYY(checkInDate!) as any}
        </Text>
      </FlexWrapper>

      <FlexWrapper>
        <Text sx={{ width: labelWidth }}>Check-out</Text>
        <Text>-</Text>
        <Text>
          {DateFormatter.getInstance().formatToDDMMYYYY(checkOutDate!) as any}
        </Text>
      </FlexWrapper>

      <FlexWrapper>
        <Text>Total length of stay:</Text>
        <Text sx={{ color: theme.palette.color.rose.main, fontWeight: 550 }}>
          {DateFormatter.getInstance().getDifferenceInDays(
            checkInDate!,
            checkOutDate!
          )}{" "}
          nights
        </Text>
      </FlexWrapper>

      <FlexWrapper
        sx={{ justifyContent: "space-between", marginTop: "0.5rem" }}
      >
        <SubTitle>You Selected</SubTitle>
        <EditIcon cursor={"pointer"} />
      </FlexWrapper>

      <MUIDivider sx={{ margin: "0.2rem 0rem 0.5rem 0rem" }} />

      <FlexWrapper>
        <Text sx={{ width: labelWidth }}>Adults</Text>
        <Text>-</Text>
        <Text>{adults}</Text>
      </FlexWrapper>

      <FlexWrapper>
        <Text sx={{ width: labelWidth }}>Childrens</Text>
        <Text>-</Text>
        <Text>{children}</Text>
      </FlexWrapper>
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
