import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material";
import MUIAvatar from "src/components/mui/MUIAvatar";
import useAuth from "src/hooks/useAuth";

type Props = {};

export default function SideMenuContent({}: Props) {
  const { user } = useAuth();
  return (
    <RootStyle>
      <UserDetailWrapper>
        <MUIAvatar name={user.userInfo.name} />
        <UserContentWrapper>
          <UserNameText>{user.userInfo.name}</UserNameText>
          <UserEmailText>{user.userInfo.email}</UserEmailText>
        </UserContentWrapper>
      </UserDetailWrapper>
    </RootStyle>
  );
}

const RootStyle = styled(Box)(() => ({
  height: "100%",
  display: "flex",
  width: "100%",
  flexDirection: "column",
  //   alignItems: "center",
  //   justifyContent
}));

const UserDetailWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  height: 60,
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  padding: "0.5rem",
  borderRadius: "10px",
  backgroundColor: theme.palette.background.default,
  overflowY: "hidden",
}));

const UserContentWrapper = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  marginLeft: "0.5rem",
  maxWidth: "80%",
  overflow: "hidden",
}));

const UserNameText = styled(Typography)(({ theme }) => ({
  fontSize: "0.9rem",
  textWrap: "nowrap",
  color: theme.palette.text.primary,
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflow: "hidden",
}));

const UserEmailText = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  textWrap: "nowrap",
  textOverflow: "ellipsis",
  color: theme.palette.text.secondary,
  whiteSpace: "nowrap",
  overflow: "hidden",
}));
