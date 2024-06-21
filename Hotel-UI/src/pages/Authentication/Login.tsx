import { Box, Typography, styled } from "@mui/material";
import Page from "../../components/Page";
import FormProvider from "../../components/Form/FormProvider";
import LoadingPage from "../../components/LoadingPage";

export default function Login() {
  return (
    <Page title="Login">
      <LoadingPage />
      <RootStyle>
        <Wrapper>
          <Heading>Sign in to your account.</Heading>
          <FieldWrapper>{/* <FormProvider></FormProvider> */}</FieldWrapper>
        </Wrapper>
      </RootStyle>
    </Page>
  );
}

const RootStyle = styled(Box)(() => ({
  height: "100%",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "red",
  zIndex: 20000,
}));

const Wrapper = styled(Box)(({ theme }) => ({
  height: 500,
  width: 500,
  borderRadius: "2rem",
  border: `1px solid ${theme.palette.divider}`,
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  backgroundColor: theme.palette.background.paper,
  padding: "1rem",
}));

const Heading = styled(Typography)(({ theme }) => ({
  textAlign: "start",
  fontSize: "1.5rem",
  color: theme.palette.text.primary,
}));

const FieldWrapper = styled(Box)(() => ({
  width: "100%",
  padding: "0.8rem",
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  marginTop: "1rem",
  gap: "0.5rem",
}));
