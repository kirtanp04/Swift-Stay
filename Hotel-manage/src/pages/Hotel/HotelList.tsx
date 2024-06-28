import { Box, Button, styled } from "@mui/material";
import { useState } from "react";
import { PlusIcon } from "src/assets/iconify";
import GridHeader from "src/components/GridHeader";
import Page from "src/components/Page";
import { MUIDataGrid } from "src/components/mui/MUIDataGrid";
import useAuth from "src/hooks/useAuth";
import AddHotelDialog from "./AddHotelDialog";
import { HotelClass } from "./DataObject";

type Props = {};

export default function HotelList({}: Props) {
  const [openAddHotelDialog, setOpenAddHotelDialog] = useState<boolean>(false);
  const [objHotel, setObjHotel] = useState<HotelClass>(new HotelClass());
  const {
    user: {
      userInfo: { email },
    },
  } = useAuth();
  // const theme = useTheme();
  // useEffect(() => {
  //   showPercentageLoading(66, theme);
  // }, []);

  const onAddNewHotel = () => {
    let _newObjHotel = new HotelClass();
    _newObjHotel.adminID = email;
    setObjHotel(_newObjHotel);
    setOpenAddHotelDialog(true);
  };
  const closeAddHotelDialogBox = () => {
    setOpenAddHotelDialog(false);
  };
  return (
    <Page title="Hotels">
      <RootStyle>
        <GridHeader>
          <Button
            onClick={onAddNewHotel}
            variant="outlined"
            startIcon={<PlusIcon height={20} width={20} />}
          >
            Add New Hotel
          </Button>
        </GridHeader>
        <MUIDataGrid
          columnVisibilityModel={{
            ID: false,
          }}
          getRowId={(row) => row._id}
          rowSelection={false}
          hideFooter
          rows={[]}
          columns={[
            {
              field: "ID",
              headerName: "ID",
              flex: 1,
            },
            {
              field: "name",
              headerName: "Name",
              flex: 1,
            },
            {
              field: "city",
              headerName: "City",
              flex: 1,
            },
            {
              field: "state",
              headerName: "State",
              flex: 1,
            },
            {
              field: "country",
              headerName: "Country",
              flex: 1,
            },
            {
              field: "zipCode",
              headerName: "Zip code",
              flex: 1,
            },
            {
              field: "phone",
              headerName: "Phone",
              flex: 1,
            },
            {
              field: "email",
              headerName: "Public Email",
              flex: 1,
            },
          ]}
        />
      </RootStyle>

      {openAddHotelDialog && (
        <AddHotelDialog onClose={closeAddHotelDialogBox} objHotel={objHotel} />
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
