import { Box, styled, useTheme } from "@mui/material";
import { useState } from "react";
import {
  CalenderIcon,
  CloseIcon,
  LocationIcon,
  PersonIcon,
} from "src/assets/iconify";
import { UserSearchObj as TUserSearchObj } from "src/context/UserSearchContext";
import useUserSearch from "src/hooks/useUserSearch";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { DatePicker } from "@mui/x-date-pickers";
// import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
// import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

const IconSize = {
  height: 22,
  width: 22,
};

export default function HomePage() {
  const { UserSearchObj } = useUserSearch();
  const [UserSearch, setUserSearch] = useState<TUserSearchObj>(UserSearchObj);
  const [ShowDateRange, setShowDateRange] = useState<boolean>(false);
  const theme = useTheme();

  const UpdateUserSearch = <K extends keyof TUserSearchObj>(
    PropertyName: K,
    value: TUserSearchObj[K]
  ) => {
    setUserSearch({ ...UserSearch, [PropertyName]: value });
  };

  const OnChangeDatePicker = (res: any) => {
    console.log(res);
  };

  return (
    <RootStyle>
      <FilterBox>
        <FilterBoxContainer>
          <LocationIcon {...IconSize} IconColor={theme.palette.text.disabled} />
          <FilterBoxButton onClick={() => setShowDateRange(true)}>
            <FilterBoxButtonText>Where are you going?</FilterBoxButtonText>
          </FilterBoxButton>
          {UserSearch.selectedCity !== "" && (
            <CloseIcon
              {...IconSize}
              IconColor={theme.palette.text.disabled}
              style={{ marginLeft: "auto" }}
            />
          )}
        </FilterBoxContainer>

        <Divider />

        <FilterBoxContainer>
          <CalenderIcon {...IconSize} IconColor={theme.palette.text.disabled} />
          <FilterBoxButton>
            <FilterBoxButtonText>
              {/* <LocalizationProvider dateAdapter={AdapterDayjs}> */}
              {/* <DemoContainer components={["SingleInputDateRangeField"]}> */}
              {/* <DatePicker
                // slots={{ field: SingleInputDateRangeField }}
                name="allowedRange"
              /> */}
              {/* </DemoContainer> */}
              {/* </LocalizationProvider> */}
            </FilterBoxButtonText>
          </FilterBoxButton>
          {UserSearch.checkInDate !== null ||
            (UserSearch.checkOutDate !== null && (
              <CloseIcon
                {...IconSize}
                IconColor={theme.palette.text.disabled}
                style={{ marginLeft: "auto" }}
              />
            ))}
        </FilterBoxContainer>

        <Divider />

        <FilterBoxContainer>
          <PersonIcon {...IconSize} IconColor={theme.palette.text.disabled} />
          <FilterBoxButton>
            <FilterBoxButtonText>
              {UserSearch.adults} adults . {UserSearch.children} children .{" "}
              {UserSearch.totalRoom} room
            </FilterBoxButtonText>
          </FilterBoxButton>
        </FilterBoxContainer>
        <Divider />
        <FilterSearchButtonWrapper>Search</FilterSearchButtonWrapper>
      </FilterBox>
    </RootStyle>
  );
}

const RootStyle = styled(Box)(() => ({
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  position: "relative",
}));

const FilterBox = styled(Box)(({ theme }) => ({
  width: "100%",
  height: 60,
  display: "flex",
  alignItems: "center",
  border: `1.5px solid ${theme.palette.border}`,
  borderRadius: "10px",
  overflow: "hidden",
}));

const FilterBoxContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  //   backgroundColor: theme.palette.text.primary,
  color: theme.palette.text.primary,
  cursor: "pointer",
  padding: "1rem",
}));

const Divider = styled(Box)(({ theme }) => ({
  width: 5,
  height: "100%",
  display: "flex",
  backgroundColor: theme.palette.border,
}));

const FilterBoxButton = styled("button")(() => ({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  border: "transparent",
  backgroundColor: "transparent",
}));

const FilterBoxButtonText = styled("span")(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "14px",
  marginLeft: "0.5rem",
  fontWeight: 500,
  overflow: "hidden",
  textOverflow: "ellipsis",
  lineHeight: "20px",
}));

const FilterSearchButtonWrapper = styled(Box)(({ theme }) => ({
  height: "100%",
  display: "flex",
  alignItems: "center",
  width: "30%",
  backgroundColor: `${theme.themeColor}`,
  color: theme.palette.text.primary,
  cursor: "pointer",
  padding: "1rem",
  justifyContent: "center",
}));
