import { Box, styled } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Page from "src/components/Page";

type Props = {};

export default function HotelList({}: Props) {
  return (
    <Page title="Hotels">
      <RootStyle>
        <DataGrid
          // rowCount={}

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
              headerName: "Email",
              flex: 1,
            },
          ]}
        />
      </RootStyle>
    </Page>
  );
}

const RootStyle = styled(Box)(() => ({
  height: "100%",
  width: "100%",
  display: "flex",
  justifyContent: "center",
}));
