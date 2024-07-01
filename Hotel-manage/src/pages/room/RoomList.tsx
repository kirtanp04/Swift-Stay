import { Button, Typography } from "@mui/material";
import { Box, styled } from "@mui/material";
import { useState } from "react";
import {
  DeleteIcon,
  EditIcon,
  PlusIcon,
  RefreshIcon,
} from "src/assets/iconify";
import GridHeader from "src/components/GridHeader";
import Page from "src/components/Page";
import { MUIDataGrid } from "src/components/mui/MUIDataGrid";
import AddRoomDialog from "./AddRoomDialog";
import { RoomClass } from "./DataObject";
import useAuth from "src/hooks/useAuth";

type Props = {};

export default function RoomList({}: Props) {
  const [stAddRoomDialog, setStAddRoomDialog] = useState<boolean>(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomClass>(new RoomClass());
  const {
    user: {
      userInfo: { id },
    },
  } = useAuth();
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
          >
            <RefreshIcon height={20} width={20} />
          </Button>
        </GridHeader>
        <MUIDataGrid
          columnVisibilityModel={{
            _id: false,
          }}
          getRowId={(row) => row._id}
          rowSelection={false}
          hideFooter
          rows={[]}
          columns={[
            {
              field: "_id",
              headerName: "ID",
              flex: 1,
            },
            {
              field: "property",
              headerName: "Property",
              width: 150, // display property name
              //   renderCell: (param: any) => (
              //     <TextWrapper>
              //       <Chip
              //         label={param.row.propertyType}
              //         color={getChipColor(param.row.propertyType) as any}
              //         variant="filled"
              //         size="small"
              //         sx={{ width: 120 }}
              //       />
              //     </TextWrapper>
              //   ),
            },
            {
              field: "roomNumber",
              headerName: "Roomn No",
              width: 100,
              renderCell: (param: any) => (
                <TextWrapper>
                  <Text>{param.row.rooms.length}</Text>
                </TextWrapper>
              ),
            },
            {
              field: "type",
              headerName: "Room Type",
              width: 200,
            },

            {
              field: "maxOccupancy",
              headerName: "Max Occupancy",
              width: 200,
            },
            {
              field: "isAvailable",
              headerName: "Available",
              width: 200,
            },
            {
              field: "price",
              headerName: "Price",
              width: 200,
            },
            {
              field: "createdAt",
              headerName: "Created On",
              width: 200,
            },
            {
              field: "updatedAt",
              headerName: "Last Updated",
              width: 200,
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
                  />
                  <DeleteIcon height={20} width={20} />
                </TextWrapper>
              ),
            },
          ]}
        />
      </RootStyle>

      {stAddRoomDialog && (
        <AddRoomDialog onClose={closeAddRoomDialog} objRoom={selectedRoom} />
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
