import { Box, styled } from "@mui/material";
import { RoomClass } from "../room/DataObject";

type Props = {
  objRoom: RoomClass;
};

export default function RoomCard({ objRoom }: Props) {
  return <RootStyle>RoomCard</RootStyle>;
}

const RootStyle = styled(Box)(({ theme }) => ({
  height: 200,
  width: 200,
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",
  padding: "0.5rem",
}));
