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
import { yupResolver } from "@hookform/resolvers/yup";
import FormProvider from "src/components/Form/FormProvider";
import FormTextFiels from "src/components/Form/FormTextField";
import Page from "src/components/Page";
import * as yup from "yup";
import { Auth, _Register } from "./AuthMgr";

const registerSchema = yup.object().shape({
  _id: yup.string(),
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Email must be a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
  profileImg: yup.string().url("Profile image must be a valid URL"),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
  role: yup
    .mixed<"guest" | "admin">()
    .oneOf(["guest", "admin"], 'Role must be either "guest" or "admin"')
    .required("Role is required"),
  createdAt: yup.date().default(() => new Date()),
});

export default function Register() {
  const _Method = useForm<_Register>({
    defaultValues: new _Register(),
    resolver: yupResolver(registerSchema) as any,
  });

  const OnSignup = (objRegister: _Register) => {
    Auth.Register(
      objRegister,
      (res) => {
        alert(res);
      },
      (err) => {
        alert(err);
      }
    );
  };

  const { handleSubmit } = _Method;
  return (
    <Page title="Signup">
      <Dialog open={true} maxWidth="sm" fullWidth>
        <DialogTitle> Sign Up</DialogTitle>
        <Divider orientation="horizontal" flexItem sx={{ mt: 2 }} />
        <FormProvider
          methods={_Method}
          onSubmit={handleSubmit(OnSignup)}
          sx={{ height: "100%", width: "100%" }}
        >
          <DialogContent>
            <FieldWrapper>
              <InputWrapper>
                <FormTextFiels
                  name="name"
                  label="Name"
                  fullWidth
                  variant="outlined"
                />
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
                <FormTextFiels
                  name="confirmPassword"
                  label="Confirm Password"
                  fullWidth
                  variant="outlined"
                />
              </InputWrapper>
              <FormTextFiels
                name="phone"
                label="Phone"
                fullWidth
                variant="outlined"
                type="number"
              />
            </FieldWrapper>
          </DialogContent>
          <Divider orientation="horizontal" flexItem />
          <DialogActions>
            <Button variant="outlined" type="submit">
              Register
            </Button>
            <Button variant="contained">Login</Button>
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
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
}));
