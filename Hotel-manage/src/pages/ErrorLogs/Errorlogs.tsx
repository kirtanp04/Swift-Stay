import { Box, Button, styled } from "@mui/material";
import { useEffect, useState } from "react";
import { StorageError } from "src/Types";
import { RefreshIcon } from "src/assets/iconify";
import GridHeader from "src/components/GridHeader";
import Page from "src/components/Page";
import { MUIDataGrid } from "src/components/mui/MUIDataGrid";
import { uuid } from "src/util/uuid";

type Props = {};

export default function Errorlogs({}: Props) {
  const [Errors, setErrors] = useState<StorageError[]>([]);

  useEffect(() => {
    const stringifyError = localStorage.getItem("Error");
    if (stringifyError) {
      let arrError: StorageError[] = JSON.parse(stringifyError);

      for (let index = 0; index < arrError.length; index++) {
        const element = arrError[index];

        element.ID = uuid();
      }

      setErrors(arrError);
    }
  }, []);
  const ClearErrorLogs = () => {
    const errorlogs = localStorage.getItem("Error");

    if (errorlogs) {
      localStorage.removeItem("Error");
      setErrors([]);
    }
  };
  return (
    <Page title="Error logs">
      <RootStyle>
        <GridHeader>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon height={20} width={20} />}
            onClick={ClearErrorLogs}
          >
            Clear Logs
          </Button>
        </GridHeader>
        <MUIDataGrid
          columnVisibilityModel={{
            ID: false,
          }}
          getRowId={(row) => row.ID!}
          rowSelection={false}
          hideFooter
          rows={Errors}
          columns={[
            {
              field: "ID",
              headerName: "ID",
              flex: 1,
            },
            {
              field: "module",
              headerName: "Module",
              flex: 0.5,
            },
            {
              field: "error",
              headerName: "Error",
              flex: 1,
            },
            {
              field: "date",
              headerName: "Date",
              flex: 0.5,
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
  flexDirection: "column",
  gap: "1rem",
  paddingTop: "0.5rem",
}));
