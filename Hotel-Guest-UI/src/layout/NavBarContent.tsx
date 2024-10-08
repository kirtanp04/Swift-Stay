import {
  Box,
  ListItemIcon,
  MenuItem,
  MenuList,
  styled,
  Typography,
} from "@mui/material";
import { Country, ICountry } from "country-state-city";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EToolTip from "src/components/EToolTip";
import IfLogedin from "src/components/IfLogedin";
import LoginPopOver from "src/components/LoginPopOver";
import { MUIMenu } from "src/components/mui/MUIMenu";
import { _UserSearchObj } from "src/context/UserSearchContext";
import useUserSearch from "src/hooks/useUserSearch";
import { Path } from "src/Router/path";
import getFlagClassName from "src/util/getCountryFlagUrl";
import "/node_modules/flag-icons/css/flag-icons.min.css";

export default function NavBarContent() {
  const navigate = useNavigate();
  const [anchorPoint, setAnchorPoint] = useState<null | HTMLElement>(null);
  const openCtxMenuPoint = Boolean(anchorPoint);
  const [countryList, setCountryList] = useState<ICountry[]>([]);
  const { UserSearchObj, UpdateFullobj } = useUserSearch();

  useEffect(() => {
    if (countryList.length === 0) {
      setCountryList(Country.getAllCountries());
    }
  }, []);

  const onSelectCountry = (objCountry: ICountry) => {
    let __UserSearchObj = new _UserSearchObj();
    __UserSearchObj.selectedCountry =
      objCountry.name + "-" + objCountry.isoCode;
    UpdateFullobj(__UserSearchObj);
    setAnchorPoint(null);
  };
  return (
    <RootStyle>
      <LogoWrapper>
        {/* <FaviconIcon /> */}
        <LogoName>Swift Stay</LogoName>
      </LogoWrapper>

      <RightContentWrapper>
        <CountryDetailWrapper onClick={(e) => setAnchorPoint(e.currentTarget)}>
          <CountryName>
            {UserSearchObj.selectedCountry.split("-")[1]}
          </CountryName>
          <span
            className={getFlagClassName(
              UserSearchObj.selectedCountry.split("-")[1] as any
            )}
          />
        </CountryDetailWrapper>

        <ListPropertyButton>List your property</ListPropertyButton>
        <IfLogedin
          Else={
            <EToolTip
              title={
                <LoginPopOver
                  text={`You are not authorize. Please login to Swift Stay to See your booking list`}
                />
              }
            >
              <ListPropertyButton>My Bookings</ListPropertyButton>
            </EToolTip>
          }
        >
          <ListPropertyButton
            onClick={() => navigate(Path.booking.bookingList)}
          >
            My Bookings
          </ListPropertyButton>
        </IfLogedin>

        <AuthWrapper>
          <IfLogedin
            Else={
              <>
                <LoginButton onClick={() => navigate(Path.login)}>
                  Sign in
                </LoginButton>
                <SignupButton onClick={() => navigate(Path.signup)}>
                  Sign up
                </SignupButton>
              </>
            }
          >
            <Logoutbutton>Logout</Logoutbutton>
          </IfLogedin>
        </AuthWrapper>
      </RightContentWrapper>

      {/* {openCtxMenuPoint && ( */}
      <MUIMenu
        open={openCtxMenuPoint}
        anchorEl={anchorPoint}
        onClose={() => setAnchorPoint(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {countryList.map((objCountry) => (
          <MenuItem
            key={objCountry.isoCode}
            onClick={() => onSelectCountry(objCountry)}
          >
            <MenuItemWrapper>
              <ListItemIcon>
                <span className={getFlagClassName(objCountry.isoCode as any)} />
              </ListItemIcon>
              <MenuList>{objCountry.name}</MenuList>
            </MenuItemWrapper>
          </MenuItem>
        ))}
      </MUIMenu>
      {/* )} */}
    </RootStyle>
  );
}

const RootStyle = styled(Box)(() => ({
  width: "100%",
  margin: "auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0rem 0.7rem",
}));

const LogoWrapper = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
}));

const LogoName = styled(Typography)(({ theme }) => ({
  fontSize: "1.5rem",
  color: theme.palette.text.primary,
  fontFamily: "Heading",
}));

const RightContentWrapper = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "2rem",
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

const ListPropertyButton = styled("button")(({ theme }) => ({
  width: "max-content",
  padding: "0.5rem",
  borderRadius: "5px",
  border: `1px solid ${theme.palette.text.primary}`,
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.neutral,
  cursor: "pointer",
  fontSize: "1rem",
}));

const AuthWrapper = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  marginLeft: "1.5rem",
}));

const LoginButton = styled("button")(({ theme }) => ({
  width: "max-content",
  padding: "0.5rem",
  borderRadius: "5px",
  border: `0px solid transparent`,
  color: theme.palette.background.default,
  backgroundColor: theme.palette.text.primary,
  cursor: "pointer",
  fontSize: "1rem",
}));

const Logoutbutton = styled("button")(({ theme }) => ({
  width: "max-content",
  padding: "0.5rem",
  borderRadius: "5px",
  border: `0px solid transparent`,
  color: theme.palette.background.default,
  backgroundColor: theme.palette.color.error.main,
  cursor: "pointer",
  fontSize: "1rem",
}));

const SignupButton = styled("button")(({ theme }) => ({
  width: "max-content",
  padding: "0.5rem",
  borderRadius: "5px",
  border: `0px solid transparent`,
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.default,
  cursor: "pointer",
  fontSize: "1rem",
}));

const MenuItemWrapper = styled(Box)(() => ({
  display: "flex",
  // justifyContent: "center",
  width: "100%",
  alignItems: "center",
  // gap: "10px",
}));
