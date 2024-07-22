import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Divider,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { FaviconIcon } from "src/assets/iconify";
import FormProvider from "src/components/Form/FormProvider";
import FormTextFiels from "src/components/Form/FormTextField";
import Page from "src/components/Page";
import useAuth from "src/hooks/useAuth";
import * as yup from "yup";
import { _Login } from "./AuthMgr";
import { CommonPath } from "src/Router/path";
import { NavLink } from "react-router-dom";

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email must be a valid email")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function Login() {
  const _Method = useForm<_Login>({
    defaultValues: new _Login(),
    resolver: yupResolver(loginSchema) as any,
  });
  const { handleSubmit } = _Method;
  const { LoginManager } = useAuth();
  const theme = useTheme();

  const onLogin = async (objLogin: _Login) => {
    await LoginManager(objLogin);
  };
  return (
    <Page title="Sign in">
      <RootStyle>
        <ContentWrapper>
          <Box
            padding={"24px"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            width={"100%"}
            height={"100%"}
            flexDirection={"column"}
          >
            <Row>
              <FaviconIcon
                height={25}
                width={25}
                IconColor={theme.themeColor}
              />
              <Typography
                marginLeft={"10px"}
                textTransform={"uppercase"}
                fontSize={"1.5rem"}
              >
                Quick Stay
              </Typography>
            </Row>

            <SignUpTextWrapper>
              <SignUpText>Sign in</SignUpText>
              <SubTitle>Enter your credentials to continue</SubTitle>
            </SignUpTextWrapper>
            <FormProvider
              methods={_Method}
              onSubmit={handleSubmit(onLogin)}
              sx={{ width: "100%" }}
            >
              <FieldWrapper>
                <InputWrapper>
                  <FormTextFiels
                    name="email"
                    label="email"
                    fullWidth
                    variant="outlined"
                  />
                </InputWrapper>
                <InputWrapper>
                  <FormTextFiels
                    name="password"
                    label="Password"
                    fullWidth
                    variant="outlined"
                    type="password"
                  />
                </InputWrapper>
              </FieldWrapper>
              <Button
                variant="outlined"
                type="submit"
                sx={{ width: "100%", marginTop: "2rem" }}
              >
                Sign In
              </Button>
            </FormProvider>
            <Divider sx={{ margin: "20px 0px" }} flexItem />

            <Row>
              <Text sx={{ fontSize: "1rem" }} to={""}>
                Don't have an account ?
              </Text>
              <Text
                sx={{
                  fontSize: "1rem",
                  marginLeft: "0.6rem",
                  color: theme.themeColor,
                  cursor: "pointer",
                }}
                to={CommonPath.signUp}
              >
                Sign up
              </Text>
            </Row>
          </Box>
        </ContentWrapper>
        <Footer>
          <FooterContent>
            <Text to={""}>Kirtanp04 Portfolio</Text>
            <Text to={""}>Quick Stay</Text>
          </FooterContent>
        </Footer>
      </RootStyle>
    </Page>
  );
}

const RootStyle = styled(Box)(({ theme }) => ({
  height: "100vh",
  width: "100%",
  backgroundColor: theme.palette.background.default,
  display: "flex",
  flexDirection: "column",
}));

const FieldWrapper = styled(Box)(() => ({
  width: "100%",
  padding: "0.8rem",
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  marginTop: "2rem",
  gap: "0.5rem",
}));

const InputWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
}));

const Row = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
}));

const ContentWrapper = styled(Box)(() => ({
  boxSizing: "border-box",
  display: "flex",
  flexFlow: "wrap",
  width: "30%",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "calc(100vh - 70px)",
  margin: "auto",
}));

const Footer = styled(Box)(() => ({
  boxSizing: "border-box",
  width: "100%",
  padding: "0px 5rem 2rem 5rem",
}));

const FooterContent = styled(Box)(() => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
}));

const Text = styled(NavLink)(({ theme }) => ({
  fontSize: "0.75rem",
  fontWeight: 400,
  color: theme.palette.text.secondary,
  fontFamily: "Roboto, sans-serif",
  lineHeight: 1.57,
  cursor: "pointer",
}));

const SignUpTextWrapper = styled(Typography)(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  width: "100%",
  alignItems: "center",
  marginTop: "2.5rem",
}));

const SignUpText = styled(Typography)(({ theme }) => ({
  fontSize: "1.25rem",
  fontWeight: 600,
  fontFamily: "Roboto, sans-serif",
  lineHeight: 1.167,
  color: theme.themeColor,
}));

const SubTitle = styled(Typography)(({ theme }) => ({
  fontSize: "16px",
  fontWeight: 600,
  fontFamily: "Roboto, sans-serif",
  lineHeight: 1.167,
  color: theme.palette.text.secondary,
  marginTop: "8px",
  textAlign: "center",
}));
