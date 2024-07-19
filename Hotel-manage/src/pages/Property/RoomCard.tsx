import {
  Box,
  Chip,
  ListItemIcon,
  MenuItem,
  MenuList,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import {
  DeleteIcon,
  EditIcon,
  PreviewIcon,
  VerticleMenuIcon,
} from "src/assets/iconify";
import { MUIMenu } from "src/components/mui/MUIMenu";
import AddRoomDialog from "../room/AddRoomDialog";
import { RoomApi, RoomClass } from "../room/DataObject";
import { getChipColor } from "../room/RoomList";
import useAuth from "src/hooks/useAuth";
import showMessage from "src/util/ShowMessage";
import showLoading from "src/util/ShowLoading";

type Props = {
  objRoom: RoomClass;
  afterDeleteRoom: (roomID: string) => void;
};

export default function RoomCard({ objRoom, afterDeleteRoom }: Props) {
  const [Room, setRoom] = useState(objRoom);
  const [anchorPoint, setAnchorPoint] = useState<null | HTMLElement>(null);
  const [showUpdateRoomDialog, setShowUpdateRoomDialog] =
    useState<boolean>(false);
  const theme = useTheme();
  const {
    user: {
      userInfo: { id },
    },
  } = useAuth();
  const openCtxMenuPoint = Boolean(anchorPoint);

  const closeUpdateRoomDialog = () => {
    setShowUpdateRoomDialog(false);
  };
  const openUpdateRoomDialog = () => {
    setShowUpdateRoomDialog(true);
    setAnchorPoint(null);
  };
  const afterSaveRoom = (_objRoom: RoomClass | undefined) => {
    if (_objRoom) {
      setRoom(_objRoom);
    }
  };

  const DeleteRoom = () => {
    debugger;
    showLoading(theme, true);
    RoomApi.deleteRoom(
      id,
      objRoom._id,
      (res) => {
        showLoading(theme, false);
        showMessage(res, theme, () => {
          setAnchorPoint(null);
          afterDeleteRoom(objRoom._id);
        });
      },
      (err) => {
        showLoading(theme, false);
        showMessage(err, theme, () => {});
        setAnchorPoint(null);
      }
    );
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
                  ? theme.palette.color.success.main
                  : theme.palette.color.error.main
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

      <EditButtonWrapper onClick={(e) => setAnchorPoint(e.currentTarget)}>
        <VerticleMenuIcon height={"100%"} />
      </EditButtonWrapper>

      {showUpdateRoomDialog && (
        <AddRoomDialog
          objRoom={Room}
          onClose={closeUpdateRoomDialog}
          afterSave={afterSaveRoom}
        />
      )}

      <MUIMenu
        open={openCtxMenuPoint}
        anchorEl={anchorPoint}
        onClose={() => setAnchorPoint(null)}
      >
        <MenuItem>
          <MenuItemWrapper onClick={openUpdateRoomDialog}>
            <ListItemIcon>
              <EditIcon
                height={17}
                width={17}
                IconColor={theme.palette.color.warning.main}
              />
            </ListItemIcon>
            <MenuList>Edit</MenuList>
          </MenuItemWrapper>
        </MenuItem>
        <MenuItem>
          <MenuItemWrapper>
            <ListItemIcon>
              <PreviewIcon
                height={17}
                width={17}
                IconColor={theme.palette.color.info.main}
              />
            </ListItemIcon>
            <MenuList>Preview</MenuList>
          </MenuItemWrapper>
        </MenuItem>
        <MenuItem>
          <MenuItemWrapper onClick={DeleteRoom}>
            <ListItemIcon>
              <DeleteIcon
                height={17}
                width={17}
                IconColor={theme.palette.color.error.main}
              />
            </ListItemIcon>
            <MenuList>Delete</MenuList>
          </MenuItemWrapper>
        </MenuItem>
      </MUIMenu>
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

const MenuItemWrapper = styled(Box)(() => ({
  display: "flex",
  // justifyContent: "center",
  width: "100%",
  alignItems: "center",
  // gap: "10px",
}));
