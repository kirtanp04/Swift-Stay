import { Box, styled } from "@mui/material";
import Page from "src/components/Page";

export default function ChatViewer() {
  return (
    <Page title="Chat">
      <RootStyle>Chat viewer</RootStyle>
    </Page>
  );
}

const RootStyle = styled(Box)(() => ({
  height: "100%",
  width: "100%",
  display: "flex",
  // justifyContent: "center",
  flexDirection: "column",
  gap: "1rem",
  paddingTop: "0.5rem",
}));
