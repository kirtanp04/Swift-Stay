import { alpha, Box, styled, Typography, useTheme } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { SendMessageIcon } from "src/assets/iconify";
import MUIAvatar from "src/components/mui/MUIAvatar";
import Page from "src/components/Page";
import Scrollbar from "src/components/Scrollbar";
import useAuth from "src/hooks/useAuth";
import { SocketService } from "src/service/Socket";
import { ChatObj, TSubscriber } from "./DataObject";
import showMessage from "src/util/ShowMessage";

export default function ChatViewer() {
  const [ChatMessages] = useState<ChatObj[]>([]);
  const [SelectedSubscriber, setSelectedSubscriber] = useState<TSubscriber>({
    email: "",
    name: "",
    profileImg: "",
  });
  const theme = useTheme();
  const {
    user: {
      userInfo: { email, id, name, role },
    },
  } = useAuth();

  const Socket = new SocketService({
    _id: id,
    email: email,
    name: name,
    role: role as any,
  });

  useEffect(() => {
    if (SelectedSubscriber.email !== "" && email !== "") {
      const _ChatObj = new ChatObj();
      _ChatObj.date = "";
      _ChatObj.key = email + SelectedSubscriber.email; // first admin email then subscriber email
      _ChatObj.message = "";
      _ChatObj.senderDetail.name = name;
      _ChatObj.senderDetail.email = email;
      Socket.joinRoom(_ChatObj);
    } else {
      showMessage(
        "Not able to join Room. Email of Subscriber / Admin is getting null",
        theme,
        () => {}
      );
    }
  }, [SelectedSubscriber]);

  useEffect(() => {
    ReceiveAllChatMessage();
  }, []);

  const ReceiveAllChatMessage = () => {
    Socket.GetChatMessage("roomJoined", (data) => {
      console.log(data);
    });
  };

  const SendMessage = () => {
    Socket.sendChatMessageInRoom("SendMessage", {
      date: "kirtan",
      key: id,
      message: "kirtan",
      senderDetail: {
        email: email,
        id: id,
        name: name,
        profileImg: "",
      },
    });
  };

  // const InitilizeChatService = () => {
  //   ChatApi.InitChatService(
  //     id,
  //     (res) => {},
  //     (err) => {
  //       showMessage(err, theme, () => {});
  //     }
  //   );
  // };

  const OnSelectSubscriber = (subscriber: TSubscriber) => {
    setSelectedSubscriber(subscriber);
  };

  return (
    <Page title="Chat">
      <RootStyle>
        <SubscriberListWrapper>
          <SubscriberListHeaderWrapper>
            <SubscriberListHeader>Subscribers</SubscriberListHeader>
          </SubscriberListHeaderWrapper>
          <SubscriberList>
            <Scrollbar>
              {/* Dummy data for subscribers */}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((val) => (
                <SubscriberDetailWrapper
                  key={val}
                  onClick={() =>
                    OnSelectSubscriber({
                      email: "subscriber" + val + "@example.com",
                      name: "Subscriber " + val,
                      profileImg: "",
                    })
                  }
                >
                  <MUIAvatar name={"Subscriber " + val} />
                  <UserContentWrapper>
                    <UserNameText>{"Subscriber " + val}</UserNameText>
                    <UserEmailText>
                      {"subscriber" + val + "@example.com"}
                    </UserEmailText>
                  </UserContentWrapper>
                </SubscriberDetailWrapper>
              ))}
            </Scrollbar>
          </SubscriberList>
        </SubscriberListWrapper>

        {/* ---------------------------------------------- */}
        <MessageContentWrapper>
          <MessageListWrapper>
            <MessageContentHeader>
              <MUIAvatar
                sx={{ height: 30, width: 30 }}
                name={SelectedSubscriber.name}
                src={SelectedSubscriber.profileImg}
              />
              <SubscriberListHeader>
                {SelectedSubscriber?.name}
              </SubscriberListHeader>
            </MessageContentHeader>
            <Scrollbar>
              <div style={{ padding: "0px 10px 10px 10px" }}>
                {ChatMessages.map((objChat, index) => (
                  <Fragment key={index}>
                    <MessageTextWrapper
                      sx={{
                        marginLeft:
                          objChat.senderDetail.email === email
                            ? "auto"
                            : "none",
                      }}
                    >
                      <MUIAvatar
                        name={objChat.senderDetail.name}
                        src={
                          objChat.senderDetail.profileImg !== ""
                            ? objChat.senderDetail.profileImg
                            : undefined
                        }
                      />
                      <Message>{objChat.message}</Message>
                      <MessageDate>{objChat.date as string}</MessageDate>
                    </MessageTextWrapper>
                  </Fragment>
                ))}
              </div>
            </Scrollbar>
          </MessageListWrapper>
          <MessageInputWrapper>
            <MessageInputField placeholder="Enter Your Message.." />
            <SendButtonWrapper onClick={SendMessage}>
              <SendMessageIcon
                height={25}
                width={25}
                IconColor={theme.palette.text.secondary}
              />
            </SendButtonWrapper>
          </MessageInputWrapper>
        </MessageContentWrapper>
      </RootStyle>
    </Page>
  );
}

const RootStyle = styled(Box)(({ theme }) => ({
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "row",
  paddingTop: "0.5rem",
  border: `1px dashed ${theme.palette.divider}`,
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
  borderBottom: `1px dashed ${theme.palette.divider}`,
}));

const MessageInputWrapper = styled(Box)(({ theme }) => ({
  height: "10%",
  width: "100%",
  display: "flex",
  alignItems: "center",
  borderTop: `1px dashed ${theme.palette.divider}`,
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
  borderLeft: `1px dashed ${theme.palette.divider}`,
}));

const MessageTextWrapper = styled(Box)(({ theme }) => ({
  minHeight: 20,
  padding: "10px",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  borderRadius: "15px",
  maxWidth: "80%",
  textWrap: "wrap",
  backgroundColor: theme.palette.grey[50012],
  gap: "10px",
  width: "max-content",
  position: "relative",
  marginTop: "10px",
}));

const Message = styled(Typography)(() => ({
  fontSize: "1rem",
  color: "white",
  textAlign: "left",
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
  color: theme.palette.text.secondary,
  marginLeft: "auto",
  position: "absolute",
  bottom: 5,
  right: 10,
  fontStyle: "italic",
}));

const SubscriberListWrapper = styled(Box)(({ theme }) => ({
  height: "100%",
  width: "30%",
  borderRight: `1px dashed ${theme.palette.divider}`,
  maxHeight: "100%",
}));

const SubscriberListHeaderWrapper = styled(Box)(({ theme }) => ({
  height: 20,
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderBottom: `1px dashed ${theme.palette.divider}`,
}));

const SubscriberListHeader = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "1rem",
  textAlign: "center",
}));

const SubscriberList = styled(Box)(() => ({
  height: "calc(100% - 20px)",
  maxHeight: "calc(100% - 20px)",
  // padding: "10px 0px",
  width: "100%",
}));

const SubscriberDetailWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 5,
  borderBottom: `1px dashed ${theme.palette.divider}`,
  overflow: "hidden",
  maxWidth: "100%",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: alpha(theme.palette.divider, 0.09),
  },
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
