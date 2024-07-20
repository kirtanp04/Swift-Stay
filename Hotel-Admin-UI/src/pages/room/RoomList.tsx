import { Box, Button, Chip, Typography, styled, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import {
  DeleteIcon,
  EditIcon,
  PlusIcon,
  PreviewIcon,
  RefreshIcon,
} from "src/assets/iconify";
import { TimeFormatter } from "src/common/TimeFormater";
import GridHeader from "src/components/GridHeader";
import Page from "src/components/Page";
import { MUIDataGrid } from "src/components/mui/MUIDataGrid";
import useAuth from "src/hooks/useAuth";
import showLoading from "src/util/ShowLoading";
import showMessage from "src/util/ShowMessage";
import AddRoomDialog from "./AddRoomDialog";
import { RoomApi, RoomClass, enumRoomType } from "./DataObject";

type Props = {};

export default function RoomList({}: Props) {
  const [stAddRoomDialog, setStAddRoomDialog] = useState<boolean>(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomClass>(new RoomClass());
  const [RoomList, setRoomList] = useState<RoomClass[]>([]);
  const {
    user: {
      userInfo: { id },
    },
  } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    getAllRooms();
  }, []);

  const getAllRooms = () => {
    showLoading(theme, true);
    RoomApi.getAllRooms(
      id,
      (res) => {
        showLoading(theme, false);
        if (res.length > 0) {
          setRoomList(res);
        }
      },
      (err) => {
        showMessage(err, theme, () => {});
        showLoading(theme, false);
      }
    );
  };

  const afterSaveRoom = () => {
    getAllRooms();
  };

  const DeleteRoom = (RoomID: string) => {
    showLoading(theme, true);
    RoomApi.deleteRoom(
      id,
      RoomID,
      (res) => {
        showLoading(theme, false);
        showMessage(res, theme, () => {});
        const updatedRoomList = RoomList.filter(
          (objRoom) => objRoom._id !== RoomID
        );
        setRoomList(updatedRoomList);
      },
      (err) => {
        showLoading(theme, false);
        showMessage(err, theme, () => {});
      }
    );
  };

  const openAddRoomDialog = () => {
    let _newRoom = new RoomClass();
    _newRoom.adminID = id;
    setSelectedRoom(_newRoom);
    setStAddRoomDialog(true);
  };
  const closeAddRoomDialog = () => {
    setStAddRoomDialog(false);
  };

  const onUpdateRoom = (objRoom: RoomClass) => {
    setSelectedRoom(objRoom);
    setStAddRoomDialog(true);
  };

  return (
    <Page title="Rooms">
      <RootStyle>
        <GridHeader>
          <Button
            variant="outlined"
            startIcon={<PlusIcon height={20} width={20} />}
            onClick={openAddRoomDialog}
          >
            Add New Room
          </Button>
          <Button
            variant="outlined"
            sx={{
              minWidth: "auto",
              marginLeft: "1rem",
            }}
            onClick={getAllRooms}
          >
            <RefreshIcon height={20} width={20} />
          </Button>
        </GridHeader>
        <MUIDataGrid
          density="compact"
          rowHeight={50}
          columnVisibilityModel={{
            _id: false,
          }}
          getRowId={(row) => row._id}
          rowSelection={false}
          hideFooter
          rows={RoomList}
          columns={[
            {
              field: "_id",
              headerName: "ID",
              flex: 1,
            },
            {
              field: "property",
              headerName: "Property",
              width: 250, // display property name
              renderCell: (param: any) => (
                <TextWrapper>
                  <Text>{param.row.property.name}</Text>
                </TextWrapper>
              ),
            },
            {
              field: "roomNumber",
              headerName: "Room No",
              width: 80,
              renderCell: (param: any) => (
                <TextWrapper>
                  <Text>{param.row.roomNumber}</Text>
                </TextWrapper>
              ),
            },
            {
              field: "type",
              headerName: "Room Type",
              width: 200,
              renderCell: (param: any) => (
                <TextWrapper>
                  <Chip
                    label={param.row.type}
                    color={getChipColor(param.row.type) as any}
                    variant="filled"
                    size="small"
                    sx={{ width: 120 }}
                  />
                </TextWrapper>
              ),
            },

            {
              field: "maxOccupancy",
              headerName: "Max Occupancy",
              width: 80,
            },
            {
              field: "isAvailable",
              headerName: "Available",
              width: 80,
            },
            {
              field: "price",
              headerName: "Price",
              width: 80,
            },
            {
              field: "createdAt",
              headerName: "Created On",
              width: 120,
              renderCell: (param: any) => (
                <TextWrapper>
                  <Text>
                    {TimeFormatter.formatTimeDifference(param.row.createdAt)}
                  </Text>
                </TextWrapper>
              ),
            },
            {
              field: "updatedAt",
              headerName: "Last Updated",
              width: 120,
              renderCell: (param: any) => (
                <TextWrapper>
                  <Text>
                    {TimeFormatter.formatTimeDifference(param.row.updatedAt)}
                  </Text>
                </TextWrapper>
              ),
            },
            {
              field: "",
              headerName: "",
              width: 150,
              renderCell: (param: any) => (
                <TextWrapper sx={{ justifyContent: "space-around !important" }}>
                  <EditIcon
                    height={20}
                    width={20}
                    onClick={() => onUpdateRoom(param.row)}
                    IconColor={theme.palette.color.warning.main}
                  />
                  <PreviewIcon
                    height={20}
                    width={20}
                    // onClick={() => onPreview(param.row._id)}
                    IconColor={theme.palette.color.info.main}
                  />
                  <DeleteIcon
                    height={20}
                    width={20}
                    onClick={() => DeleteRoom(param.row._id)}
                    IconColor={theme.palette.color.error.main}
                  />
                </TextWrapper>
              ),
            },
          ]}
        />
      </RootStyle>

      {stAddRoomDialog && (
        <AddRoomDialog
          onClose={closeAddRoomDialog}
          objRoom={selectedRoom}
          afterSave={afterSaveRoom}
        />
      )}
    </Page>
  );
}

const RootStyle = styled(Box)(() => ({
  height: "100%",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  gap: "1rem",
  paddingTop: "0.5rem",
  padding: "0.7rem 1.2rem",
}));

const TextWrapper = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "0.4rem",
  overflow: "hidden",
  gap: "0.7rem",
  height: "100%",
}));

const Text = styled(Typography)(({ theme }) => ({
  fontSize: "0.8rem",
  color: theme.palette.text.secondary,
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  textWrap: "nowrap",
}));

export const getChipColor = (_RoomType: enumRoomType): string => {
  let color: string = "";

  if (_RoomType === enumRoomType.Double_Room) {
    color = "primary";
  }
  if (_RoomType === enumRoomType.Executive_Room) {
    color = "secondary";
  }
  if (_RoomType === enumRoomType.Juniour_Suites) {
    color = "error";
  }
  if (_RoomType === enumRoomType.King_Room) {
    color = "info";
  }
  if (_RoomType === enumRoomType.Queen_Room) {
    color = "success";
  }
  if (_RoomType === enumRoomType.Single_Room) {
    color = "warning";
  }
  if (_RoomType === enumRoomType.Triple_Room) {
    color = "secondary";
  }

  return color;
};
