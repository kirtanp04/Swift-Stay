import {
  Box,
  Divider,
  Drawer,
  Stack,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { CloseIcon } from "src/assets/iconify";
import MUIAvatar from "src/components/mui/MUIAvatar";
import Scrollbar from "src/components/Scrollbar";
import useAuth from "src/hooks/useAuth";
import { Property } from "src/ObjMgr/Property";
import { SocketService } from "src/service/Socket";
import { ChatObj } from "./DataObject";
import showMessage from "src/util/ShowMessage";
import axios from "axios";

type Props = {
  open: boolean;
  onClose: () => void;
  property: Property;
};

export default function Chat({ open, property, onClose }: Props) {
  const [chatMessages, setChatMessages] = useState<ChatObj[]>([]);
  const [ShowTypingLoading, setShowTypingLoading] = useState<boolean>(false);
  const theme = useTheme();
  const {
    user: {
      userInfo: { profileImg, name, email, id, role },
    },
  } = useAuth();

  const _Socket = new SocketService(
    {
      _id: id,
      email: email,
      name: name,
      role: role as any,
    },
    GetChatMessage,
    onUserTyping,
    GetChatError
  );

  useEffect(() => {
    const init = async () => {
      await axios.get("http://localhost:50001/hellow");
    };
    const _ChatObj = new ChatObj();
    _ChatObj.key = email + email; // first admin email then subscriber email -- change email to id
    _Socket.joinRoom(_ChatObj);
  }, []);

  const GetChatObj = (message: string, key?: string): ChatObj => {
    const _ChatObj = new ChatObj();
    _ChatObj.date = new Date();
    _ChatObj.key = key ? key : email + email;
    _ChatObj.message = message;
    _ChatObj.senderDetail = {
      _id: id,
      email: email,
      name: name,
      profileImg: "",
    };

    return _ChatObj;
  };

  function GetChatMessage(msg: ChatObj) {
    let newChatObj = new ChatObj();
    newChatObj = { ...msg, date: msg.date };
    setChatMessages((prevMessages) => [...prevMessages, newChatObj]);
    setShowTypingLoading(false);
  }

  function GetChatError(err: string) {
    showMessage(err, "error", theme, () => {});
  }

  function onUserTyping(msg: ChatObj) {
    if (!ShowTypingLoading) {
      setShowTypingLoading(true);
    }
    if (msg) {
    }
  }

  return (
    <RootStyle anchor={"right"} open={open} transitionDuration={2}>
      <Wrapper>
        <HeaderWrapper>
          <Stack
            direction={"row"}
            gap={"3px"}
            alignItems={"flex-start"}
            flex={1}
          >
            <MUIAvatar name={property.name} src={property.images[0]} />
            <Box>
              <SubTitle>{property.name}</SubTitle>
              <Text>{property.email}</Text>
            </Box>
          </Stack>

          <CloseDrawerBtn onClick={onClose}>
            <CloseIcon IconColor={theme.palette.background.default} />
          </CloseDrawerBtn>
        </HeaderWrapper>
        <Divider sx={{ margin: "5px 0px" }} />
        <ChatWrapper>
          <Scrollbar sx={{ height: "100%", width: "100%" }}>
            <MessageTextWrapper
              sx={{
                backgroundColor: theme.palette.color.violet.lighter,
                marginRight: "auto",
              }}
            >
              <MUIAvatar name={property.name} src={property.images[0]} />
              <Box width={"100%"}>
                <MessageText>
                  Hellow user how are you doing how are you doing how are you
                  doing
                </MessageText>
                <Text
                  sx={{
                    justifyContent: "end",
                    color: theme.palette.background.default,
                  }}
                >
                  {new Date().toDateString()}
                </Text>
              </Box>
            </MessageTextWrapper>

            <MessageTextWrapper
              sx={{
                backgroundColor: theme.palette.background.neutral,
                marginLeft: "auto",
              }}
            >
              {profileImg !== "" ? (
                <MUIAvatar name={name} src={profileImg} />
              ) : (
                <MUIAvatar name={name} />
              )}

              <Box width={"100%"}>
                <MessageText>
                  Hellow user how are you doing how are you doing how are you
                  doing
                </MessageText>
                <Text sx={{ justifyContent: "end" }}>
                  {new Date().toDateString()}
                </Text>
              </Box>
            </MessageTextWrapper>
          </Scrollbar>
        </ChatWrapper>
        <Divider sx={{ margin: "5px 0px" }} />
        <MessageTextFieldWrapper>
          <MessageInputField placeholder="Type your question here." />
          <SendButtonWrapper>Send</SendButtonWrapper>
        </MessageTextFieldWrapper>
      </Wrapper>
    </RootStyle>
  );
}

const RootStyle = styled(Drawer)(() => ({
  "& .MuiDrawer-paper": {
    width: 500,
  },
}));

const Wrapper = styled(Box)(() => ({
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  padding: "0.8rem",
}));

const HeaderWrapper = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
}));

const CloseDrawerBtn = styled(Box)(({ theme }) => ({
  width: 30,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: 30,
  borderRadius: "5px",
  backgroundColor: theme.palette.color.violet.darker,
  cursor: "pointer",
  marginLeft: "auto",
}));

const ChatWrapper = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  flex: 1,
  marginTop: "1rem",
}));

const MessageTextFieldWrapper = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  height: 40,
}));

const MessageInputField = styled("input")(() => ({
  height: "100%",
  width: "85%",
  padding: "0px 10px",
  fontSize: "0.9rem",
  backgroundColor: "transparent",
  border: "none",
  outline: "none",
}));

const SendButtonWrapper = styled(Box)(({ theme }) => ({
  height: "100%",
  width: "15%",
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
  width: "80%",
  gap: "10px",
  minWidth: "25%",
  position: "relative",
  marginTop: "10px",
  overflow: "hidden",
}));

const MessageText = styled(Typography)(({ theme }) => ({
  fontSize: "0.85rem",
  color: theme.palette.text.primary,
  width: "100%",
  textWrap: "wrap",
}));

const SubTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  color: theme.palette.text.primary,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "flex",
  alignItems: "center",
}));

const Text = styled(Typography)(({ theme }) => ({
  fontSize: "0.8rem",
  color: theme.palette.text.secondary,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "flex",
  alignItems: "center",
}));
