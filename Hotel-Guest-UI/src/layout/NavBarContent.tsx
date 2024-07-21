import { Box, styled, Typography } from "@mui/material";

import FlagIcon from "src/components/FlagIcon";

type Props = {};

export default function NavBarContent({}: Props) {
  return (
    <RootStyle>
      <LogoWrapper>
        {/* <FaviconIcon /> */}
        <LogoName>Swift Stay</LogoName>
      </LogoWrapper>

      <RightContentWrapper>
        <CountryDetailWrapper>
          <CountryName>IND</CountryName>
          <FlagIcon countryName="India" />
        </CountryDetailWrapper>

        <ListPropertyButton>List your property</ListPropertyButton>

        <AuthWrapper>
          <LoginButton>Sign in</LoginButton>
          <SignupButton>Sign up</SignupButton>
        </AuthWrapper>
      </RightContentWrapper>
    </RootStyle>
  );
}

const RootStyle = styled(Box)(() => ({
  width: "80%",
  margin: "auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
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
