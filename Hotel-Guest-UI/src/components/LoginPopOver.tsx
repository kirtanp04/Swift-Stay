import { Box, styled, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Path } from "src/Router/path";

type Props = {
  text?: string;
};

export default function LoginPopOver({ text }: Props) {
  const navigate = useNavigate();

  const onClickLogin = () => {
    navigate(Path.login);
  };
  return (
    <RootStyle>
      <Text>
        {text
          ? text
          : " You are not authorize to access this. Please login to Swift Stay to move further"}
      </Text>
      <Button onClick={onClickLogin}>Login</Button>
    </RootStyle>
  );
}

const RootStyle = styled(Box)(() => ({
  minHeight: 90,
  width: 250,
  padding: "0.5rem",
  display: "flex",
  flexDirection: "column",
}));

const Text = styled(Typography)(({ theme }) => ({
  fontSize: "0.95rem",
  color: theme.palette.text.primary,
  flex: 1,
  textWrap: "wrap",
}));

const Button = styled(Box)(({ theme }) => ({
  padding: "0.3rem 0.9rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "0.95rem",
  color: theme.palette.text.primary,
  backgroundColor: theme.themeColor,
  borderRadius: "5px",
  cursor: "pointer",
  marginTop: "0.5rem",
  marginLeft: "auto",
}));
