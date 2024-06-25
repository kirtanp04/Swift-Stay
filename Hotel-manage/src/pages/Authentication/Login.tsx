import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  styled,
} from "@mui/material";
import { useForm } from "react-hook-form";
import FormProvider from "src/components/Form/FormProvider";
import FormTextFiels from "src/components/Form/FormTextField";
import Page from "src/components/Page";
import useAuth from "src/hooks/useAuth";
import * as yup from "yup";
import { _Login } from "./AuthMgr";

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

  const onLogin = async (objLogin: _Login) => {
    await LoginManager(objLogin);
  };
  return (
    <Page title="Login">
      <Dialog open={true} maxWidth="xs" fullWidth>
        <DialogTitle> Login</DialogTitle>
        <Divider orientation="horizontal" flexItem sx={{ mt: 2 }} />
        <FormProvider
          methods={_Method}
          onSubmit={handleSubmit(onLogin)}
          sx={{ height: "100%", width: "100%" }}
        >
          <DialogContent>
            <FieldWrapper>
              <InputWrapper>
                <FormTextFiels
                  name="email"
                  label="Email"
                  fullWidth
                  variant="outlined"
                  type="email"
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
          </DialogContent>
          <Divider orientation="horizontal" flexItem />
          <DialogActions>
            <Button variant="outlined" type="submit">
              Login
            </Button>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </Page>
  );
}

const FieldWrapper = styled(Box)(() => ({
  width: "100%",
  padding: "0.8rem",
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  marginTop: "0.5rem",
  gap: "0.5rem",
  height: "100%",
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
