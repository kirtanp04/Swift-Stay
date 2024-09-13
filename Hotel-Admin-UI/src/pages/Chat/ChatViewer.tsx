import { Box, styled, Typography, useTheme } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { HotelIcon, SendMessageIcon } from "src/assets/iconify";
import MUIAvatar from "src/components/mui/MUIAvatar";
import Page from "src/components/Page";
import Scrollbar from "src/components/Scrollbar";
import { SocketIoBaseUrl, SocketKeyName } from "src/Constant";
import useAuth from "src/hooks/useAuth";
import { SocketService } from "src/service/Socket";
import showMessage from "src/util/ShowMessage";
import { enumUserRole } from "../Authentication/AuthMgr";
import { ChatApi, ChatObj, ChatUser } from "./DataObject";

export default function ChatViewer() {
  const [Message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatObj[]>([]);
  const [Users, setUsers] = useState<ChatUser[]>([]);
  const [SelectedUser, setSelectedUser] = useState<ChatUser>(new ChatUser());

  const {
    user: {
      userInfo: { email, name, id, role },
    },
  } = useAuth();
  const theme = useTheme();

  const _Socket = useMemo(() => {
    return new SocketService(
      SocketIoBaseUrl,
      {
        _id: id,
        email: email,
        name: name,
        role: role as any,
      },
      GetChatMessage,

      GetChatError,
      (value) => {
        if (value == false) {
          InitRedis();
        }
      }
    );
  }, []);

  useEffect(() => {
    ChatApi.GetAllChatBookedUser(
      id,
      (res) => {
        setUsers(res);
      },
      (err) => {
        showMessage(err, theme, () => {});
      }
    );
  }, []);

  const InitRedis = () => {
    ChatApi.InitRedis(
      id,
      role,
      (res) => {
        // alert('init redis')
        showMessage(res, theme, () => {});
      },

      (err) => {
        showMessage(err, theme, () => {});
      }
    );
  };

  const GetChatObj = (message: string): ChatObj => {
    const _ChatObj = new ChatObj();
    _ChatObj.date = new Date();
    _ChatObj.key = SelectedUser.propertyID + SelectedUser.user._id;
    _ChatObj.message = message;
    _ChatObj.senderDetail = {
      _id: id,
      email: email,
      name: name,
      profileImg: "",
      role: role as enumUserRole,
    };

    return _ChatObj;
  };

  function GetChatMessage(msg: ChatObj) {
    let newChatObj = new ChatObj();
    newChatObj = { ...msg, date: msg.date };

    setChatMessages((prevMessages) => [...prevMessages, newChatObj]);
  }

  function GetChatError(err: string) {
    showMessage(err, theme, () => {});
  }

  const SendMessage = () => {
    _Socket.sendChatMessageInRoom(
      SocketKeyName.SendMessage,
      GetChatObj(Message),
      (err) => {
        console.log("err", err);
      }
    );
    setMessage("");
  };

  const OnChangeMessage = (value: string) => {
    // if (!ShowTypingLoading) {
    //   _Socket.sendChatMessageInRoom(
    //     SocketKeyName.TypingMessage,
    //     GetChatObj("user is typing")
    //   );
    // }
    setMessage(value);
  };

  const OnSelectSubscriber = (objUser: ChatUser) => {
    setSelectedUser(objUser);
    const _ChatObj = new ChatObj();
    _ChatObj.key = objUser.propertyID + objUser.user._id;
    _Socket.joinRoom(_ChatObj);
  };

  return (
    <Page title="Chat">
      <RootStyle>
        <SubscriberListWrapper>
          <SubscriberListHeaderWrapper>
            <SubscriberListHeader>Users</SubscriberListHeader>
          </SubscriberListHeaderWrapper>
          <SubscriberList>
            <Scrollbar sx={{ height: "100%" }}>
              {Users.map((objUser) => (
                <SubscriberDetailWrapper
                  key={objUser._id}
                  onClick={() => OnSelectSubscriber(objUser)}
                >
                  <MUIAvatar name={objUser.user.name} />
                  <UserContentWrapper>
                    <UserNameText>{objUser.user.name}</UserNameText>
                    <UserEmailText>
                      <span style={{ marginRight: "5px" }}>
                        <HotelIcon height={15} width={15} />
                      </span>
                      {objUser.PropertyName}
                    </UserEmailText>
                  </UserContentWrapper>
                </SubscriberDetailWrapper>
              ))}
            </Scrollbar>
          </SubscriberList>
        </SubscriberListWrapper>

        <MessageContentWrapper>
          <MessageListWrapper>
            <MessageContentHeader>
              {SelectedUser.user.profileImg !== "" ? (
                <MUIAvatar
                  sx={{ height: 30, width: 30 }}
                  name={SelectedUser.user.name}
                  src={SelectedUser.user.profileImg}
                />
              ) : (
                <MUIAvatar
                  sx={{ height: 30, width: 30 }}
                  name={SelectedUser.user.name}
                />
              )}
              <SubscriberListHeader>
                {SelectedUser.user?.name}
              </SubscriberListHeader>
              <SubscriberListHeader
                sx={{ marginLeft: "auto", color: theme.themeColor }}
              >
                {SelectedUser.PropertyName}
              </SubscriberListHeader>
            </MessageContentHeader>
            <Scrollbar>
              <div style={{ padding: "0px 10px 10px 10px" }}>
                {chatMessages.map((objChat, i) => (
                  <MessageTextWrapper
                    sx={{
                      backgroundColor:
                        objChat.senderDetail.email === email
                          ? theme.palette.text.primary
                          : theme.palette.grey[50012],
                      marginRight:
                        objChat.senderDetail.email !== email ? "auto" : null,
                      marginLeft:
                        objChat.senderDetail.email === email ? "auto" : null,
                    }}
                    key={i}
                  >
                    <MUIAvatar
                      name={objChat.senderDetail.name}
                      src={
                        objChat.senderDetail.profileImg !== ""
                          ? objChat.senderDetail.profileImg
                          : undefined
                      }
                    />
                    <MessageText
                      sx={{
                        color:
                          objChat.senderDetail.email === email
                            ? theme.palette.background.default
                            : theme.palette.text.primary,
                      }}
                    >
                      {objChat.message}
                    </MessageText>
                    <MessageDate>{objChat.date as any}</MessageDate>
                  </MessageTextWrapper>
                ))}
              </div>
            </Scrollbar>
          </MessageListWrapper>
          <MessageInputWrapper>
            <MessageInputField
              placeholder="Enter Your Message.."
              onChange={(e) => OnChangeMessage(e.target.value)}
            />
            <SendButtonWrapper onClick={SendMessage}>
              <SendMessageIcon
                height={25}
                width={25}
                IconColor={theme.themeColor}
              />
            </SendButtonWrapper>
          </MessageInputWrapper>
        </MessageContentWrapper>
      </RootStyle>
    </Page>
  );
}

const RootStyle = styled(Box)(() => ({
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "row",
  paddingTop: "0.5rem",
  // border: `1px dashed ${theme.palette.divider}`,
  borderRadius: "10px",
}));

const MessageContentWrapper = styled(Box)(() => ({
  height: "100%",
  width: "100%",
}));

const MessageContentHeader = styled(Box)(({ theme }) => ({
  padding: "0px 10px 10px 10px",
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  borderBottom: `1px solid ${theme.palette.divider}`,
  height: 40,
}));

const MessageInputWrapper = styled(Box)(({ theme }) => ({
  height: "10%",
  width: "100%",
  display: "flex",
  alignItems: "center",
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const MessageInputField = styled("input")(() => ({
  height: "100%",
  width: "90%",
  padding: "0px 10px",
  fontSize: "0.9rem",
  backgroundColor: "transparent",
  border: "none",
  outline: "none",
}));

const SendButtonWrapper = styled(Box)(({ theme }) => ({
  height: "100%",
  width: "10%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  borderLeft: `1px solid ${theme.palette.divider}`,
}));

const MessageTextWrapper = styled(Box)(() => ({
  minHeight: 20,
  padding: "10px",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  borderRadius: "15px",
  maxWidth: "80%",
  textWrap: "wrap",

  gap: "10px",
  minWidth: "25%",
  position: "relative",
  marginTop: "10px",
  overflow: "hidden",
}));

const MessageText = styled(Typography)(() => ({
  fontSize: "0.85rem",
  width: "100%",
  textWrap: "wrap",
}));

const MessageListWrapper = styled(Box)(() => ({
  display: "flex",
  height: "90%",
  maxHeight: "90%",
  width: "100%",
  flexDirection: "column",
  justifyContent: "flex-end",
}));

const MessageDate = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  color: theme.themeColor,
  marginLeft: "auto",
  position: "absolute",
  bottom: 5,
  right: 10,
  fontStyle: "italic",
  fontWeight: 700,
}));

const SubscriberListWrapper = styled(Box)(({ theme }) => ({
  height: "100%",
  width: "30%",
  borderRight: `1px solid ${theme.palette.divider}`,
  maxHeight: "100%",
}));

const SubscriberListHeaderWrapper = styled(Box)(({ theme }) => ({
  padding: "0px 10px 10px 10px",
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  borderBottom: `1px solid ${theme.palette.divider}`,
  height: 40,
  justifyContent: "center",
}));

const SubscriberListHeader = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "1rem",
  textAlign: "center",
}));

const SubscriberList = styled(Box)(() => ({
  height: "calc(100% - 38px)",
  overflowY: "auto",
  maxHeight: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
}));

const SubscriberDetailWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: "10px",
  cursor: "pointer",
  gap: "10px",
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&:hover": {
    backgroundColor: theme.palette.background.neutral,
  },
}));

const UserContentWrapper = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: "5px",
}));

const UserNameText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "1rem",
  textAlign: "left",
}));

const UserEmailText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.85rem",
  textAlign: "left",
  display: "flex",
  alignItems: "center",
}));
