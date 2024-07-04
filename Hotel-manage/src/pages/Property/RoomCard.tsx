import { Box, Chip, Typography, styled, useTheme } from "@mui/material";
import { RoomClass } from "../room/DataObject";
import { getChipColor } from "../room/RoomList";
import { EditIcon } from "src/assets/iconify";
import { useState } from "react";
import AddRoomDialog from "../room/AddRoomDialog";

type Props = {
  objRoom: RoomClass;
};

//image 1
//type
//available
//price

export default function RoomCard({ objRoom }: Props) {
  const [Room, setRoom] = useState(objRoom);
  const [showUpdateRoomDialog, setShowUpdateRoomDialog] =
    useState<boolean>(false);
  const theme = useTheme();
  const closeUpdateRoomDialog = () => {
    setShowUpdateRoomDialog(false);
  };
  const openUpdateRoomDialog = () => {
    setShowUpdateRoomDialog(true);
  };
  const afterSaveRoom = (_objRoom: RoomClass | undefined) => {
    if (_objRoom) {
      setRoom(_objRoom);
    }
  };
  return (
    <RootStyle>
      <Image alt="room Img" src={Room.images[0]} />
      <ContentWrapper>
        <TextWrapper>
          <Label>Room No </Label>
          <Text>: {Room.roomNumber}</Text>
        </TextWrapper>
        <TextWrapper>
          <Label>Type : </Label>
          <EChip
            label={Room.type}
            color={getChipColor(Room.type) as any}
            variant="outlined"
            size="small"
          />
        </TextWrapper>
        <TextWrapper>
          <Label>Available </Label>
          <Text
            sx={{
              color: `${
                Room.isAvailable
                  ? theme.palette.success.main
                  : theme.palette.error.main
              } !important`,
            }}
          >
            : {Room.isAvailable ? "True" : "False"}
          </Text>
        </TextWrapper>
        <TextWrapper>
          <Label>Price </Label>
          <Text>: {Room.price}</Text>
        </TextWrapper>
      </ContentWrapper>

      <EditButtonWrapper onClick={openUpdateRoomDialog}>
        <EditIcon height={"100%"} width={"100%"} />
      </EditButtonWrapper>

      {showUpdateRoomDialog && (
        <AddRoomDialog
          objRoom={Room}
          onClose={closeUpdateRoomDialog}
          afterSave={afterSaveRoom}
        />
      )}
    </RootStyle>
  );
}

const RootStyle = styled(Box)(({ theme }) => ({
  height: "auto",
  width: 200,
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: "20px",
  display: "flex",
  flexDirection: "column",
  padding: "0.5rem",
  minHeight: 200,
  position: "relative",
}));

const Image = styled("img")(() => ({
  width: "100%",
  height: 100,
  objectFit: "cover",
  borderRadius: "15px",
}));

const ContentWrapper = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  paddingTop: "0.5rem",
  gap: "5xp",
}));

const TextWrapper = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

const Label = styled(Typography)(({ theme }) => ({
  fontSize: "0.8rem",
  color: theme.palette.text.secondary,
  width: "4rem",
}));

const Text = styled(Typography)(({ theme }) => ({
  fontSize: "0.8rem",
  color: theme.palette.text.primary,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

const EChip = styled(Chip)(() => ({
  "& .MuiChip-label": {
    fontSize: "0.7rem",
  },
}));

const EditButtonWrapper = styled(Box)(() => ({
  height: 20,
  width: 20,
  position: "absolute",
  bottom: "10px",
  right: "10px",
  cursor: "pointer",
}));
