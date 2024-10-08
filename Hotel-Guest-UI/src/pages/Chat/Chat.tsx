import {
  Box,
  Divider,
  Drawer,
  Stack,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { useMemo, useState } from "react";
import { CloseIcon } from "src/assets/iconify";
import { TimeFormatter } from "src/common/TimeFormater";
import MUIAvatar from "src/components/mui/MUIAvatar";
import Scrollbar from "src/components/Scrollbar";
import { ChatSocketIoBaseUrl, SocketKeyName } from "src/Constant";
import useAuth from "src/hooks/useAuth";
import { Property } from "src/ObjMgr/Property";
import { SocketService } from "src/service/Socket";
import showMessage from "src/util/ShowMessage";
import { enumUserRole } from "../Authentication/AuthMgr";
import { Chat as TChat } from "./DataObject";
import showLoading from "src/util/ShowLoading";

type Props = {
  open: boolean;
  onClose: () => void;
  property: Property;
  propertyID: string;
};

export default function Chat({ open, property, onClose, propertyID }: Props) {
  const [chatMessages, setChatMessages] = useState<TChat[]>([]);
  // const [refersh, setRefresh] = useState<boolean>(false);
  const [Message, setMessage] = useState("");
  const theme = useTheme();
  const {
    user: {
      userInfo: { name, email, id, role },
    },
  } = useAuth();

  const _Socket = useMemo(() => {
    return new SocketService(
      ChatSocketIoBaseUrl,
      {
        _id: id,
        email: email,
        name: name,
        role: role as any,
      },
      GetChatMessage,
      onUserTyping,
      GetChatError,
      (value) => {
        if (value == false) {
          InitRedis();
        }
      }
    );
  }, []);

  const InitRedis = () => {
    TChat.InitRedis(
      id,
      role,
      () => {
        getChatData();
        const _ChatObj = new TChat();
        _ChatObj.key = propertyID + id;
        _Socket.joinRoom(_ChatObj, (err) => {
          showMessage(err, "error", theme, () => {});
        });
      },
      (err) => {
        showMessage(err, "error", theme, () => {});
      }
    );
  };

  const getChatData = () => {
    showLoading(theme, true);
    TChat.GetChatData(
      id,
      role,
      propertyID + id,
      (res) => {
        setChatMessages(res.chatInfo);
        showLoading(theme, false);
      },
      (err) => {
        showMessage(err, "error", theme, () => {});
        showLoading(theme, false);
      }
    );
  };

  const GetChatObj = (message: string): TChat => {
    const _ChatObj = new TChat();
    _ChatObj.date = new Date();
    _ChatObj.key = propertyID + id;
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

  const SendMessage = () => {
    _Socket.sendChatMessageInRoom(
      SocketKeyName.SendMessage,
      GetChatObj(Message),
      (err) => {
        console.log(err);
      }
    );
    setMessage("");
  };

  function GetChatMessage(msg: TChat) {
    let newChatObj = new TChat();
    console.log(msg);
    newChatObj = { ...msg, date: msg.date };
    setChatMessages((prevMessages) => [...prevMessages, newChatObj]);
  }

  function GetChatError(err: string) {
    showMessage(err, "error", theme, () => {});
  }

  function onUserTyping(msg: TChat) {
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

          <CloseDrawerBtn
            onClick={() => {
              _Socket.disconnect();
              onClose();
            }}
          >
            <CloseIcon IconColor={theme.palette.background.default} />
          </CloseDrawerBtn>
        </HeaderWrapper>
        <Divider sx={{ margin: "5px 0px" }} />

        <ChatWrapper>
          <Scrollbar sx={{ height: "100%", width: "100%" }}>
            {chatMessages.map((objChat, i) => (
              <MessageTextWrapper
                sx={{
                  backgroundColor:
                    objChat.senderDetail.email === email
                      ? theme.palette.background.neutral
                      : theme.palette.color.violet.lighter,
                  marginRight:
                    objChat.senderDetail.email !== email ? "auto" : null,
                  marginLeft:
                    objChat.senderDetail.email === email ? "auto" : null,
                }}
                key={i}
              >
                <MUIAvatar name={property.name} src={property.images[0]} />
                <Box width={"100%"}>
                  <MessageText>{objChat.message}</MessageText>
                  <Text
                    sx={{
                      justifyContent: "end",
                      color: theme.palette.background.default,
                    }}
                  >
                    {TimeFormatter.formatTimeDifference(objChat.date)}
                  </Text>
                </Box>
              </MessageTextWrapper>
            ))}
          </Scrollbar>
        </ChatWrapper>
        <Divider sx={{ margin: "5px 0px" }} />
        <MessageTextFieldWrapper>
          <MessageInputField
            placeholder="Type your question here."
            value={Message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <SendButtonWrapper onClick={SendMessage}>Send</SendButtonWrapper>
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
