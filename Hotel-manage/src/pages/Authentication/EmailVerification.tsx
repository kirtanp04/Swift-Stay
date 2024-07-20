import { Box, Typography, styled, useTheme } from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { LoadingAnimation } from "src/assets/iconify";
import Page from "src/components/Page";
import useAuth from "src/hooks/useAuth";

export default function EmailVerification() {
  const theme = useTheme();
  const { token } = useParams();
  const { VerifyEmail } = useAuth();

  useEffect(() => {
    VerifyEmail(token!);
  }, []);

  //   alert(username! + token!);
  return (
    <Page title="Email verification">
      <RootStyle>
        <LoadingAnimation IconColor={theme.themeColor} height={40} width={40} />
        <Text>Verifying Email with the Account....</Text>
      </RootStyle>
    </Page>
  );
}

const RootStyle = styled(Box)(({ theme }) => ({
  height: "100vh",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.background.default,
}));

const Text = styled(Typography)(({ theme }) => ({
  fontSize: "1.5rem",
  color: theme.palette.text.primary,
  marginLeft: "2rem",
}));
