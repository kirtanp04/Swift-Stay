import {
  Box,
  Divider,
  List,
  Tooltip,
  Typography,
  Zoom,
  styled,
  useTheme,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { Path } from "src/Router/path";
import { TMenuList } from "src/Types";
import {
  BookingIcon,
  ChatIcon,
  DarkModeIcon,
  ErrorLogIcon,
  GraphIcon,
  HotelIcon,
  LightModeIcon,
  LogoutIcon,
  ReviewIcon,
  RoomIcon,
} from "src/assets/iconify";
import ScrollBar from "src/components/Scrollbar";
import MUIAvatar from "src/components/mui/MUIAvatar";
import useAuth from "src/hooks/useAuth";
import useThemeSetting from "src/hooks/useThemesetting";

type Props = {};

export default function SideMenuContent({}: Props) {
  const { user } = useAuth();
  const theme = useTheme();
  const { mode, ChangeMode } = useThemeSetting();

  const MenuList: TMenuList[] = [
    {
      name: "Dashboard",
      icon: (
        <GraphIcon
          height={25}
          width={25}
          IconColor={theme.palette.text.primary}
        />
      ),
      path: Path.dashboard,
    },
    {
      name: "Property",
      icon: (
        <HotelIcon
          height={25}
          width={25}
          IconColor={theme.palette.text.primary}
        />
      ),
      path: Path.property.root,
    },
    {
      name: "Rooms",
      icon: (
        <RoomIcon
          height={25}
          width={25}
          IconColor={theme.palette.text.primary}
        />
      ),
      path: Path.room.root,
    },
    {
      name: "Bookings",
      icon: (
        <BookingIcon
          height={25}
          width={25}
          IconColor={theme.palette.text.primary}
        />
      ),
      path: Path.booking.root,
    },
    {
      name: "Reviews",
      icon: (
        <ReviewIcon
          height={25}
          width={25}
          IconColor={theme.palette.text.primary}
        />
      ),
      path: Path.review.root,
    },
    {
      name: "Chats",
      icon: (
        <ChatIcon
          height={25}
          width={25}
          IconColor={theme.palette.text.primary}
        />
      ),
      path: Path.chat.root,
    },
    {
      name: "Error logs",
      icon: (
        <ErrorLogIcon
          height={25}
          width={25}
          IconColor={theme.palette.text.primary}
        />
      ),
      path: Path.errorLogs,
    },
  ];

  return (
    <RootStyle>
      <UserDetailWrapper>
        <MUIAvatar name={user.userInfo.name} />
        <UserContentWrapper>
          <UserNameText>{user.userInfo.name}</UserNameText>
          <UserEmailText>{user.userInfo.email}</UserEmailText>
        </UserContentWrapper>
      </UserDetailWrapper>
      <ListWrapper>
        {/* <Divider flexItem /> */}
        <ScrollBar sx={{ height: "100%", width: "100%" }}>
          <EList>
            {MenuList.map((objListItem, index) => (
              <NavLink to={objListItem.path} style={{ textDecoration: "none" }}>
                {({ isActive }) => (
                  <ListItemWrapper
                    key={index}
                    sx={{
                      "&:hover": {
                        background: theme.palette.background.neutral,
                      },
                      background: isActive
                        ? theme.palette.background.default
                        : "transparent",
                      border: isActive
                        ? `1px solid ${theme.palette.text.secondary}`
                        : "0px solid transparent",
                    }}
                  >
                    {objListItem.icon}
                    <ListText>{objListItem.name}</ListText>
                  </ListItemWrapper>
                )}
              </NavLink>
            ))}
          </EList>
        </ScrollBar>
      </ListWrapper>
      <Divider flexItem />
      <ThemeWrapper>
        {mode === "dark" ? (
          <Tooltip title="Turn to Light mode" arrow TransitionComponent={Zoom}>
            <LightModeIcon
              height={25}
              width={25}
              style={{ cursor: "pointer" }}
              onClick={() => ChangeMode("light")}
            />
          </Tooltip>
        ) : (
          <Tooltip title="Turn to Light mode" arrow TransitionComponent={Zoom}>
            <DarkModeIcon
              height={25}
              width={25}
              style={{ cursor: "pointer" }}
              onClick={() => ChangeMode("dark")}
            />
          </Tooltip>
        )}
      </ThemeWrapper>
      <ListItemWrapper sx={{ backgroundColor: theme.palette.error.main }}>
        <LogoutIcon height={25} width={25} />
        <ListText>Logout</ListText>
      </ListItemWrapper>
    </RootStyle>
  );
}

const RootStyle = styled(Box)(() => ({
  height: "100%",
  display: "flex",
  width: "100%",
  flexDirection: "column",
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
  border: `1px solid ${theme.palette.text.secondary}`,
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

const ListWrapper = styled(Box)(() => ({
  paddingTop: "3rem",
  maxHeight: "82%",
  height: "82%",
  overflow: "auto",
  paddingBottom: "1rem",
}));

const EList = styled(List)(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  width: "100%",
  gap: "0.9rem",
}));

const ListItemWrapper = styled(Box)(() => ({
  marginTop: "auto",
  width: "100%",
  height: 40,
  display: "flex",
  justifyContent: "start",
  alignItems: "center",
  borderRadius: "10px",
  cursor: "pointer",
  padding: "0.5rem 2rem",
}));

const ListText = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  color: theme.palette.text.primary,
  marginLeft: "2rem",
}));

const ThemeWrapper = styled(Box)(() => ({
  width: "100%",
  height: 80,
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
}));
