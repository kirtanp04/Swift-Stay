import { Box, Checkbox, styled, Typography, useTheme } from "@mui/material";
import { Country, ICity } from "country-state-city";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { GetAllCityByCountryAndState } from "src/common/common";
import { MUISlider } from "src/components/mui/MUISlider";
import Scrollbar from "src/components/Scrollbar";
import { enumPropertyType } from "src/ObjMgr/Property";
import showMessage from "src/util/ShowMessage";
import { FilterClass } from "../DataObj/DataObj";

type Props = {
  onSearchbyFilter: (objFilter: any) => void;
};

const CommonPadding = "0.5rem 0.7rem";
const PropertyTypes: enumPropertyType[] = [
  enumPropertyType.Apartment,
  enumPropertyType.Bungalow,
  enumPropertyType.Cottage,
  enumPropertyType.Hotel,
  enumPropertyType.Resort,
  enumPropertyType.Villa,
];

export default function Filter({ onSearchbyFilter }: Props) {
  const [currency, setCurrency] = useState<string>("");
  const [Cities, setCities] = useState<ICity[]>([]);
  const theme = useTheme();
  const { country, state } = useParams();
  const FilterobjRef = useRef<FilterClass>(new FilterClass());
  useEffect(() => {
    try {
      const _Country = Country.getCountryByCode(country!.split("-")[1]);
      setCurrency(_Country?.currency!);
    } catch (error: any) {
      showMessage(error.message, theme, () => {});
    }
  }, [country]);

  useEffect(() => {
    try {
      const countryCode = country?.split("-")[1];
      const stateCode = state?.split("-")[1];

      if (countryCode !== undefined && stateCode !== undefined) {
        const getAllCities = async () => {
          await GetAllCityByCountryAndState(countryCode, stateCode)
            .then((res) => setCities(res))
            .catch((err) => showMessage(err, theme, () => {}));
        };

        getAllCities();
      } else {
        showMessage("Invalid country or state", theme, () => {});
      }
    } catch (error: any) {
      showMessage(error.message, theme, () => {});
    }
  }, [state, country]);

  const onSearch = () => {
    // const filterInfo = FilterClass.getFilterObj(FilterobjRef.current);
    onSearchbyFilter(FilterobjRef.current);
  };
  return (
    <Box
      sx={{
        width: 300,
        border: `1px solid ${theme.palette.border}`,
        maxHeight: "85vh",
        borderRadius: "10px",
        overflow: "hidden",
        position: "relative",
        top: 10,
        // backgroundColor: theme.palette.grey[500_32],
      }}
    >
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
            <HeaderText sx={{ color: theme.themeColor }}>
              Filter By :
            </HeaderText>
          </HeaderWrapper>

          <FilterContent>
            <HeaderWrapper>
              <HeaderText>Your budget (per night)</HeaderText>
            </HeaderWrapper>
            <FilterContentWrapper>
              <ContentText>
                0 {currency} - {FilterobjRef.current.Price} {currency}
              </ContentText>

              <MUISlider
                size="small"
                defaultValue={70}
                aria-label="Small"
                valueLabelDisplay="auto"
                max={2000}
                min={FilterobjRef.current.Price}
                sx={{ width: "calc(100% - 20px)" }}
                onChange={(e, num) => {
                  FilterobjRef.current.Price = num as number;
                  if (e) {
                  }
                }}
              />
            </FilterContentWrapper>
          </FilterContent>

          <FilterContent>
            <HeaderWrapper>
              <HeaderText>Property type</HeaderText>
            </HeaderWrapper>
            <FilterContentWrapper>
              {PropertyTypes.map((type) => (
                <Row key={type}>
                  <ECheckBox
                    onChange={(e) => {
                      if (e.target.checked) {
                        FilterobjRef.current.propertyType.push(type);
                      } else {
                        const updated =
                          FilterobjRef.current.propertyType.filter(
                            (_type) => _type !== type
                          );
                        FilterobjRef.current.propertyType = updated;
                      }
                    }}
                  />
                  <ContentText>{type}</ContentText>
                </Row>
              ))}
            </FilterContentWrapper>
          </FilterContent>

          <FilterContent>
            <HeaderWrapper>
              <HeaderText>Cities</HeaderText>
            </HeaderWrapper>
            <FilterContentWrapper sx={{ maxHeight: 220, overflow: "auto" }}>
              {Cities.map((city) => (
                <Row key={city.stateCode}>
                  <ECheckBox
                    onChange={(e) => {
                      if (e.target.checked) {
                        FilterobjRef.current.city.push(city.name);
                      } else {
                        const updated = FilterobjRef.current.city.filter(
                          (_city) => _city !== city.name
                        );
                        FilterobjRef.current.city = updated;
                      }
                    }}
                  />
                  <ContentText>{city.name}</ContentText>
                </Row>
              ))}
            </FilterContentWrapper>
          </FilterContent>
        </Scrollbar>
        <SearchButtonWrapper onClick={onSearch}>
          <HeaderText sx={{ color: theme.palette.text.primary }}>
            Search
          </HeaderText>
        </SearchButtonWrapper>
      </RootStyle>
    </Box>
  );
}

const RootStyle = styled(Box)(() => ({
  position: "sticky",
  height: "100%",
  width: "100%",
  top: 0,
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
  justifyContent: "start",
  padding: "0rem 0rem 0rem 1rem",
}));

const ContentText = styled(Typography)(({ theme }) => ({
  fontSize: "0.85rem",
  color: theme.palette.text.secondary,
  textAlign: "start",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflow: "hidden",
}));

const SearchButtonWrapper = styled(Box)(({ theme }) => ({
  height: 40,
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.themeColor,
  position: "absolute",
  bottom: 0,
  cursor: "pointer",
}));

const Row = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: "5px",
}));

const ECheckBox = styled(Checkbox)(() => ({
  "& .Mui-checked": {
    color: "red !important",
  },
  "& .MuiSvgIcon-fontSizeMedium": {
    height: 20,
    width: 20,
  },
  padding: "2px",
}));
