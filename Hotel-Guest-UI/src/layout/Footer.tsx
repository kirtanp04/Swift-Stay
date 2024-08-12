import { Box, styled, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import useUserSearch from "src/hooks/useUserSearch";
import getFlagClassName from "src/util/getCountryFlagUrl";

export default function Footer() {
  const { UserSearchObj } = useUserSearch();
  return (
    <RootStyle>
      <FooterWrapper>
        <FooterContent>
          <CountryDetailWrapper>
            <CountryName>
              {UserSearchObj.selectedCountry.split("-")[1]}
            </CountryName>
            <span
              className={getFlagClassName(
                UserSearchObj.selectedCountry.split("-")[1] as any
              )}
            />
          </CountryDetailWrapper>
          {/* <Text to={""}>Kirtanp04 Portfolio</Text> */}
          <Text to={""}>Quick Stay</Text>
        </FooterContent>
      </FooterWrapper>
    </RootStyle>
  );
}

const RootStyle = styled(Box)(({ theme }) => ({
  height: 100,
  width: "100%",
  backgroundColor: theme.palette.background.neutral,
}));

const FooterWrapper = styled(Box)(() => ({
  boxSizing: "border-box",
  width: "100%",
  height: "100%",
  padding: "0px 5rem 2rem 5rem",
}));

const CountryDetailWrapper = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  cursor: "pointer",
}));

const CountryName = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  color: theme.palette.text.primary,
}));

const FooterContent = styled(Box)(() => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
  alignItems: "center",
  height: "100%",
}));

const Text = styled(NavLink)(({ theme }) => ({
  fontSize: "0.75rem",
  fontWeight: 400,
  color: theme.palette.text.secondary,
  fontFamily: "Roboto, sans-serif",
  lineHeight: 1.57,
  cursor: "pointer",
}));
