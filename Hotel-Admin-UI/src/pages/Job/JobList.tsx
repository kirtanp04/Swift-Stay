import {
  Box,
  Button,
  Chip,
  styled,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
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
import { MUIDataGrid } from "src/components/mui/MUIDataGrid";
import Page from "src/components/Page";
import useAuth from "src/hooks/useAuth";
import showLoading from "src/util/ShowLoading";
import showMessage from "src/util/ShowMessage";
import { enumJobStatus, enumJobType, Job } from "./Dataobject";
import NewJobForm from "./NewJobForm";

export default function JobList() {
  const [Jobs, setJobs] = useState<Job[]>([]);
  const [SelectedJob, setSelectedJobs] = useState<Job>(new Job());
  const [ShowNewjobFormDialog, setShowNewjobFormDialog] =
    useState<boolean>(false);
  const {
    user: {
      userInfo: { id },
    },
  } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    GetJobList();
  }, []);

  const GetJobList = () => {
    try {
      showLoading(theme, true);
      Job.GetJobList(
        id,
        (res) => {
          showLoading(theme, false);
          setJobs(res);
        },
        (err) => {
          showLoading(theme, false);
          showMessage(err, theme, () => {});
        }
      );
    } catch (error: any) {
      showLoading(theme, false);
      showMessage(error.message, theme, () => {});
    }
  };

  return (
    <Page title="Jobs">
      <RootStyle>
        <GridHeader>
          <Button
            onClick={() => {
              if (SelectedJob._id !== "") {
                setSelectedJobs(new Job());
              }
              setShowNewjobFormDialog(true);
            }}
            variant="outlined"
            startIcon={<PlusIcon height={20} width={20} />}
          >
            Create New Job
          </Button>
          <Button
            onClick={GetJobList}
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
          rows={Jobs}
          columns={[
            {
              field: "PropertyName",
              headerName: "Property",
              width: 200,
            },
            {
              field: "JobType",
              headerName: "JobType",
              width: 120,
              renderCell: (param: any) => (
                <TextWrapper>
                  <Chip
                    label={param.row.JobType}
                    variant="filled"
                    size="small"
                    sx={{
                      backgroundColor: JobTypeBGColor(param.row.JobType, theme),
                      padding: "0rem 0.5rem 0rem 0.5rem",
                    }}
                  />
                </TextWrapper>
              ),
            },
            {
              field: "salary",
              headerName: "salary",
              width: 100,
              renderCell: (param: any) => (
                <TextWrapper>
                  <Text>{param.row.currency + " " + param.row.salary}</Text>
                </TextWrapper>
              ),
            },
            {
              field: "category",
              headerName: "Category",
              width: 150,
              renderCell: (param: any) => (
                <TextWrapper>
                  <Text>{param.row.category}</Text>
                </TextWrapper>
              ),
            },
            {
              field: "status",
              headerName: "Status",
              width: 100,
              renderCell: (param: any) => (
                <TextWrapper>
                  <Chip
                    label={param.row.status}
                    variant="filled"
                    size="small"
                    sx={{
                      backgroundColor: JobstatusBGColor(
                        param.row.status,
                        theme
                      ),
                      padding: "0rem 0.5rem 0rem 0.5rem",
                    }}
                  />
                </TextWrapper>
              ),
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
                    IconColor={theme.palette.color.warning.main}
                  />
                  <PreviewIcon
                    height={20}
                    width={20}
                    IconColor={theme.palette.color.info.main}
                  />
                  <DeleteIcon
                    height={20}
                    width={20}
                    IconColor={theme.palette.color.error.main}
                  />
                </TextWrapper>
              ),
            },
          ]}
        />

        {ShowNewjobFormDialog && (
          <NewJobForm
            objJob={SelectedJob}
            onClose={() => setShowNewjobFormDialog(false)}
          />
        )}
      </RootStyle>
    </Page>
  );
}

const JobstatusBGColor = (status: enumJobStatus, theme: Theme) => {
  switch (status) {
    case enumJobStatus.OPEN:
      return theme.palette.color.success.main;

    case enumJobStatus.CLOSED:
      return theme.palette.color.rose.main;

    case enumJobStatus.PENDING:
      return theme.palette.color.warning.main;

    default:
      return "gray";
  }
};

const JobTypeBGColor = (status: enumJobType, theme: Theme) => {
  switch (status) {
    case enumJobType.CONTRACT:
      return theme.palette.color.violet.main;

    case enumJobType.FULL_TIME:
      return theme.palette.color.secondary.main;

    case enumJobType.PART_TIME:
      return theme.palette.color.primary.main;

    default:
      return "gray";
  }
};

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
  justifyContent: "flex-start",
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
