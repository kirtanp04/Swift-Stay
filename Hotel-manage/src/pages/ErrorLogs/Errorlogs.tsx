import { Box } from "@mui/material";
import { styled } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useId, useState } from "react";
import { StorageError } from "src/Types";
import Page from "src/components/Page";

type Props = {};
// module: string,
//     error: any,
//     date: Date

export default function Errorlogs({}: Props) {
  const [Errors, setErrors] = useState<StorageError[]>([]);
  const ID = useId();

  useEffect(() => {
    const stringifyError = localStorage.getItem("Error");
    if (stringifyError) {
      let arrError: StorageError[] = JSON.parse(stringifyError);

      for (let index = 0; index < arrError.length; index++) {
        const element = arrError[index];

        element.ID = ID;
      }

      setErrors(arrError);
    }
  }, []);
  return (
    <Page title="Error logs">
      <RootStyle>
        <DataGrid
          columnVisibilityModel={{
            ID: false,
          }}
          getRowId={(row) => row.ID!}
          loading={Errors.length === 0}
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
}));
