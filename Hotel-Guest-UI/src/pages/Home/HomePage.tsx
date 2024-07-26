import { Box, styled, useTheme } from "@mui/material";
import { useState } from "react";
import {
  CalenderIcon,
  CloseIcon,
  LocationIcon,
  PersonIcon,
} from "src/assets/iconify";
import DateFormatter from "src/common/DateFormate";
import DataPickerDialog from "src/components/UserSearchInput/DataPickerDialog";
import SearchCityDialog from "src/components/UserSearchInput/SearchCityDialog";
import { UserSearchObj as TUserSearchObj } from "src/context/UserSearchContext";
import useAuth from "src/hooks/useAuth";
import useUserSearch from "src/hooks/useUserSearch";

const IconSize = {
  height: 22,
  width: 22,
};

export default function HomePage() {
  const { UserSearchObj } = useUserSearch();
  const [UserSearch, setUserSearch] = useState<TUserSearchObj>(UserSearchObj);
  const [ShowDateRange, setShowDateRange] = useState<boolean>(false);
  const [ShowSelectCityDialog, setShowSelectCityDialog] =
    useState<boolean>(false);
  const theme = useTheme();
  const {
    user: {
      userInfo: { country },
    },
  } = useAuth();
  const _Date = DateFormatter.getInstance();

  const UpdateUserSearch = <K extends keyof TUserSearchObj>(
    PropertyName: K,
    value: TUserSearchObj[K]
  ) => {
    setUserSearch({ ...UserSearch, [PropertyName]: value });
  };

  const onSelectDateRange = (startDate: Date, endDate: Date) => {
    setUserSearch({
      ...UserSearch,
      checkInDate: startDate,
      checkOutDate: endDate,
    });
  };

  const onSelectState = (stateName: string) => {
    UpdateUserSearch("selectedState", stateName);
  };

  return (
    <RootStyle>
      <FilterBox>
        <FilterBoxContainer>
          <LocationIcon
            {...IconSize}
            IconColor={theme.palette.text.secondary}
          />
          <FilterBoxButton onClick={() => setShowSelectCityDialog(true)}>
            <FilterBoxButtonText>
              {UserSearch.selectedState !== ""
                ? UserSearch.selectedState
                : "Where are you going?"}
            </FilterBoxButtonText>
          </FilterBoxButton>
          {UserSearch.selectedState !== "" && (
            <CloseIcon
              {...IconSize}
              IconColor={theme.palette.text.disabled}
              style={{ marginLeft: "auto" }}
              onClick={() =>
                setUserSearch({ ...UserSearch, selectedState: "" })
              }
            />
          )}
        </FilterBoxContainer>

        <Divider />

        <FilterBoxContainer>
          <CalenderIcon
            {...IconSize}
            IconColor={theme.palette.text.secondary}
          />
          <FilterBoxButton onClick={() => setShowDateRange(true)}>
            <FilterBoxButtonText>
              {UserSearch.checkInDate !== null
                ? _Date.formatToDDMMYYYY(UserSearch.checkInDate)
                : "Check-in date"}
              {"  "}|{"  "}
              {UserSearch.checkOutDate !== null
                ? _Date.formatToDDMMYYYY(UserSearch.checkOutDate)
                : "Check-out date"}
            </FilterBoxButtonText>
          </FilterBoxButton>
          {UserSearch.checkInDate !== null && (
            <CloseIcon
              {...IconSize}
              IconColor={theme.palette.text.disabled}
              style={{ marginLeft: "auto" }}
              onClick={() =>
                setUserSearch({
                  ...UserSearch,
                  checkInDate: null,
                  checkOutDate: null,
                })
              }
            />
          )}
        </FilterBoxContainer>

        <Divider />

        <FilterBoxContainer>
          <PersonIcon {...IconSize} IconColor={theme.palette.text.secondary} />
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

      {ShowDateRange && (
        <DataPickerDialog
          defaultStartDate={UserSearch.checkInDate}
          onClose={() => setShowDateRange(false)}
          defaultEndDate={UserSearch.checkOutDate}
          onSelectDateRange={onSelectDateRange}
        />
      )}

      {ShowSelectCityDialog && (
        <SearchCityDialog
          onClose={() => setShowSelectCityDialog(false)}
          countryCode={country.split("-")[1]}
          onSelectState={onSelectState}
        />
      )}
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
  cursor: "pointer",
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
