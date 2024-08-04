import { Box, styled, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import {
  CalenderIcon,
  CloseIcon,
  LocationIcon,
  PersonIcon,
} from "src/assets/iconify";
import DateFormatter from "src/common/DateFormate";
import DataPickerDialog from "src/components/UserSearchInput/DataPickerDialog";
import SearchStateDialog from "src/components/UserSearchInput/SearchStateDialog";
import { _UserSearchObj as TUserSearchObj } from "src/context/UserSearchContext";
import useUserSearch from "src/hooks/useUserSearch";

import { useNavigate } from "react-router-dom";
import { Path } from "src/Router/path";
import ExploreByProperty from "./components/ExploreByProperty";
import ExploreCountryState from "./components/ExploreCountryState";
import TrendingDestinations from "./components/TrendingDestinations";

const IconSize = {
  height: 22,
  width: 22,
};

export default function HomePage() {
  const { UserSearchObj, UpdateFullobj } = useUserSearch();
  const [UserSearch, setUserSearch] = useState<TUserSearchObj>(UserSearchObj);
  const [ShowDateRange, setShowDateRange] = useState<boolean>(false);
  const [ShowSearchStateDialog, setShowSearchStateDialog] =
    useState<boolean>(false);

  // console.log(UserSearchObj);

  const navigate = useNavigate();

  //--------------------------
  const theme = useTheme();

  const _Date = DateFormatter.getInstance();

  useEffect(() => {
    setUserSearch(UserSearchObj);
  }, [UserSearchObj]);

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

  const OnSearch = () => {
    navigate(
      Path.PropertyListByState.root(
        UserSearch.selectedCountry,
        UserSearch.selectedState
      ) + "?page=1"
    );
    UpdateFullobj(UserSearch);
  };

  return (
    <RootStyle>
      <FilterBox>
        <FilterBoxContainer>
          <LocationIcon
            {...IconSize}
            IconColor={theme.palette.text.secondary}
          />
          <FilterBoxButton onClick={() => setShowSearchStateDialog(true)}>
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
        <FilterSearchButtonWrapper onClick={OnSearch}>
          Search
        </FilterSearchButtonWrapper>
      </FilterBox>

      <ContentWrapper>
        {/* --------------------------------------------- Trending------------------------------------------------------------- */}
        <HeaderWrapper>
          <HeaderTitle>Trending destinations</HeaderTitle>
          <HeaderSubtitle>
            Most popular choices for travellers from
            <span
              style={{
                color: theme.palette.color.info.main,
                marginLeft: "10px",
                fontSize: "1rem",
              }}
            >
              {UserSearch.selectedCountry.split("-")[0]}
            </span>
          </HeaderSubtitle>
        </HeaderWrapper>
        <TrendingDestinations />
        {/* --------------------------------------------- Explore More------------------------------------------------------------- */}
        <HeaderWrapper>
          <HeaderTitle>
            Explore
            <span
              style={{
                color: theme.palette.color.info.main,
                marginLeft: "5px",
              }}
            >
              {UserSearch.selectedCountry.split("-")[0]}
            </span>
          </HeaderTitle>
          <HeaderSubtitle>
            These popular destinations have a lot to offer
          </HeaderSubtitle>
        </HeaderWrapper>

        <ExploreCountryState />

        {/* --------------------------------------------- Explore by Propertry type------------------------------------------------------------- */}
        <HeaderWrapper>
          <HeaderTitle>Browse by property type</HeaderTitle>
        </HeaderWrapper>
        <ExploreByProperty />
      </ContentWrapper>

      {ShowDateRange && (
        <DataPickerDialog
          defaultStartDate={UserSearch.checkInDate}
          onClose={() => setShowDateRange(false)}
          defaultEndDate={UserSearch.checkOutDate}
          onSelectDateRange={onSelectDateRange}
        />
      )}

      {ShowSearchStateDialog && (
        <SearchStateDialog
          onClose={() => setShowSearchStateDialog(false)}
          countryCode={UserSearch.selectedCountry.split("-")[1]}
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
  paddingBottom: "3rem",
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
const ContentWrapper = styled(Box)(() => ({
  height: "auto",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "3rem",
  marginTop: "3rem",
}));

const HeaderWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  borderBottom: `1px solid ${theme.palette.border}`,
  justifyContent: "flex-start",
  paddingBottom: "10px",
}));

const HeaderTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.4rem",
  color: theme.palette.text.primary,
}));

const HeaderSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: "0.9rem",
  color: theme.palette.text.secondary,
}));
