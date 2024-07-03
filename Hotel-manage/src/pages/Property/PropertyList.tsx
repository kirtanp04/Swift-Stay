import { Box, Button, Chip, Typography, styled, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import AddPropertyDialog from "./AddPropertyDialog";
import { PropertyApi, PropertyClass, enumPropertyType } from "./DataObject";

type Props = {};

export default function HotelList({}: Props) {
  const [propertyList, setPropertyList] = useState<PropertyClass[]>([]);
  const [openAddHotelDialog, setOpenAddHotelDialog] = useState<boolean>(false);
  const [objPropert, setObjPropert] = useState<PropertyClass>(
    new PropertyClass()
  );
  const {
    user: {
      userInfo: { id },
    },
  } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (propertyList.length === 0) {
      getAllProperty();
    }
  }, []);

  const getAllProperty = () => {
    showLoading(theme, true);
    PropertyApi.getAllProperty(
      id,
      (res) => {
        if (res.length > 0) {
          setPropertyList(res);
        }
        showLoading(theme, false);
      },
      (err) => {
        showMessage(err, theme, () => {});
        showLoading(theme, false);
      }
    );
  };

  const deleteProperty = (PropertyID: string) => {
    showLoading(theme, true);
    PropertyApi.deleteProperty(
      id,
      PropertyID,
      (res) => {
        const _updated = propertyList.filter(
          (objProperty) => objProperty._id !== PropertyID
        );
        setPropertyList(_updated);
        showMessage(res, theme, () => {});
        showLoading(theme, false);
      },
      (err) => {
        showMessage(err, theme, () => {});
        showLoading(theme, false);
      }
    );
  };

  const onEditProperty = (objProperty: PropertyClass) => {
    setObjPropert(objProperty);
    setOpenAddHotelDialog(true);
  };

  const onAddNewHotel = () => {
    let _newObjHotel = new PropertyClass();
    _newObjHotel.adminID = id;
    setObjPropert(_newObjHotel);
    setOpenAddHotelDialog(true);
  };
  const closeAddHotelDialogBox = () => {
    setOpenAddHotelDialog(false);
  };

  const onPreview = (PropertyID: string) => {
    navigate(PropertyID);
  };
  return (
    <Page title="Property">
      <RootStyle>
        <GridHeader>
          <Button
            onClick={onAddNewHotel}
            variant="outlined"
            startIcon={<PlusIcon height={20} width={20} />}
          >
            Add New Property
          </Button>
          <Button
            onClick={getAllProperty}
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
          density="compact"
          rowHeight={50}
          columnVisibilityModel={{
            _id: false,
          }}
          getRowId={(row) => row._id}
          rowSelection={false}
          hideFooter
          rows={propertyList}
          columns={[
            {
              field: "_id",
              headerName: "ID",
              flex: 1,
            },
            {
              field: "name",
              headerName: "Name",
              width: 200,
            },
            {
              field: "propertyType",
              headerName: "Property type",
              width: 150,
              renderCell: (param: any) => (
                <TextWrapper>
                  <Chip
                    label={param.row.propertyType}
                    color={getChipColor(param.row.propertyType) as any}
                    variant="filled"
                    size="small"
                    sx={{ width: 120 }}
                  />
                </TextWrapper>
              ),
            },
            {
              field: "rooms",
              headerName: "Total rooms",
              width: 100,
              renderCell: (param: any) => (
                <TextWrapper>
                  <Text>{param.row.rooms.length}</Text>
                </TextWrapper>
              ),
            },
            {
              field: "city",
              headerName: "City",
              width: 200,
            },
            {
              field: "state",
              headerName: "State",
              width: 200,
            },
            {
              field: "country",
              headerName: "Country",
              width: 200,
            },
            {
              field: "zipCode",
              headerName: "Zip code",
              width: 200,
            },
            {
              field: "phone",
              headerName: "Phone",
              width: 200,
            },
            {
              field: "email",
              headerName: "Public Email",
              width: 200,
            },
            {
              field: "createdAt",
              headerName: "Created On",
              width: 200,
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
              width: 200,
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
                    onClick={() => onEditProperty(param.row)}
                  />
                  <PreviewIcon
                    height={20}
                    width={20}
                    onClick={() => onPreview(param.row._id)}
                  />
                  <DeleteIcon
                    height={20}
                    width={20}
                    onClick={() => deleteProperty(param.row._id)}
                  />
                </TextWrapper>
              ),
            },
          ]}
        />
      </RootStyle>

      {openAddHotelDialog && (
        <AddPropertyDialog
          onClose={closeAddHotelDialogBox}
          objProperty={objPropert}
          getAllProperty={getAllProperty}
        />
      )}
    </Page>
  );
}

export const getChipColor = (_PropertyType: enumPropertyType): string => {
  let color: string = "";

  if (_PropertyType === enumPropertyType.Apartment) {
    color = "primary";
  }
  if (_PropertyType === enumPropertyType.Bungalow) {
    color = "warning";
  }
  if (_PropertyType === enumPropertyType.Hotel) {
    color = "error";
  }
  if (_PropertyType === enumPropertyType.Resort) {
    color = "secondary";
  }

  return color;
};

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
