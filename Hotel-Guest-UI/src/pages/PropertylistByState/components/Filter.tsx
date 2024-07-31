import { Box, styled, Typography, useTheme } from "@mui/material";
import { Country } from "country-state-city";
import { useEffect, useState } from "react";
import { MUISlider } from "src/components/mui/MUISlider";
import Scrollbar from "src/components/Scrollbar";
import useUserSearch from "src/hooks/useUserSearch";
import { FilterClass } from "../DataObj/DataObj";

type Props = {};

const CommonPadding = "0.5rem 0.7rem";

export default function Filter({}: Props) {
  const [currency, setCurrency] = useState<string>("");
  const [ObjFilter, setObjFilter] = useState<FilterClass>(new FilterClass());
  const theme = useTheme();
  const { UserSearchObj } = useUserSearch();
  useEffect(() => {
    const _Country = Country.getCountryByCode(
      UserSearchObj.selectedCountry.split("-")[1]
    );
    setCurrency(_Country?.currency!);
  }, [UserSearchObj]);
  return (
    <RootStyle>
      <Scrollbar
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          alignItems: "center",
          width: "100%",
        }}
      >
        <HeaderWrapper
          sx={{
            borderBottom: `1px solid ${theme.palette.border}`,
            fontWeight: 600,
            padding: CommonPadding,
          }}
        >
          <HeaderText sx={{ color: theme.palette.color.purple.main }}>
            Filter By :
          </HeaderText>
        </HeaderWrapper>
        <FilterContent>
          <HeaderWrapper>
            <HeaderText>Your budget (per night)</HeaderText>
          </HeaderWrapper>
          <FilterContentWrapper>
            <ContentText>
              0 {currency} - {ObjFilter.minPrice} {currency}
            </ContentText>

            <MUISlider
              size="small"
              defaultValue={70}
              aria-label="Small"
              valueLabelDisplay="auto"
              max={2000}
              min={ObjFilter.minPrice}
              sx={{ width: "calc(100% - 20px)" }}
            />
          </FilterContentWrapper>
        </FilterContent>
      </Scrollbar>
      <SearchButtonWrapper>
        <HeaderText sx={{ color: theme.palette.text.primary }}>
          Search
        </HeaderText>
      </SearchButtonWrapper>
    </RootStyle>
  );
}

const RootStyle = styled(Box)(({ theme }) => ({
  height: "100%",
  width: 250,
  border: `1px solid ${theme.palette.border}`,
  maxHeight: "100%",
  borderRadius: "10px",
  overflow: "hidden",
  position: "relative",
}));

const HeaderWrapper = styled(Box)(() => ({
  //   height: 60,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
}));

const HeaderText = styled(Typography)(({ theme }) => ({
  fontSize: "0.9rem",
  color: theme.palette.text.primary,
  textAlign: "start",
}));

const FilterContent = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  borderBottom: `1px solid ${theme.palette.border}`,
  padding: CommonPadding,
}));

const FilterContentWrapper = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  marginTop: "10px",
  justifyContent: "start",
  padding: "0rem 0rem 0rem 1rem",
}));

const ContentText = styled(Typography)(({ theme }) => ({
  fontSize: "0.85rem",
  color: theme.palette.text.secondary,
  textAlign: "start",
}));

const SearchButtonWrapper = styled(Box)(({ theme }) => ({
  height: 40,
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.color.purple.main,
  position: "absolute",
  bottom: 0,
  cursor: "pointer",
}));
