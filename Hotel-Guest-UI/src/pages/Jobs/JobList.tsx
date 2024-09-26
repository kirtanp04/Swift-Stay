import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { enumJobStatus, enumJobType, Job } from "./DataObject";
import showMessage from "src/util/ShowMessage";
import {
  Box,
  Chip,
  Paper,
  styled,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import Page from "src/components/Page";
import { Table } from "@mui/material";
import { MUITableCell, MUITableRow } from "src/components/mui/MUITable";
import DateFormatter from "src/common/DateFormate";
import showLoading from "src/util/ShowLoading";
import { PreviewIcon } from "src/assets/iconify";
import { Path } from "src/Router/path";

export default function JobList() {
  const [JobList, setJobList] = useState<Job[]>([]);
  const { propertyName, propertyID } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    getJobListByProperty();
  }, [propertyID, propertyName]);

  const getJobListByProperty = () => {
    showLoading(theme, true);
    try {
      Job.GetJobsByPropertyID(
        propertyID!,

        (res) => {
          showLoading(theme, false);
          setJobList(res);
        },
        (err) => {
          showLoading(theme, false);
          showMessage(err, "error", theme, () => {});
        }
      );
    } catch (error: any) {
      showMessage(error.message, "error", theme, () => {});
    }
  };
  return (
    <Page title={propertyName + " Job list"}>
      <RootStyle>
        <HeaderWrapper>
          <HeaderTitle>Job List</HeaderTitle>
        </HeaderWrapper>

        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: 700, width: "100%" }}
            aria-label="customized table"
          >
            <TableHead>
              <TableRow>
                <MUITableCell align="center">Title</MUITableCell>
                <MUITableCell align="center">JobType</MUITableCell>

                <MUITableCell align="center">Salary</MUITableCell>
                <MUITableCell align="center">Posted on</MUITableCell>
                <MUITableCell align="center">Status</MUITableCell>
                <MUITableCell align="center">Preview</MUITableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {JobList.map((objJob) => (
                <MUITableRow
                  key={objJob._id}
                  sx={{
                    "& .MuiTableCell-body": {
                      height: 50,
                    },
                  }}
                >
                  <MUITableCell component="th" scope="row" align="center">
                    <HeaderSubtitle>{objJob.title}</HeaderSubtitle>
                  </MUITableCell>

                  <MUITableCell component="th" scope="row" align="center">
                    <Chip
                      label={objJob.JobType}
                      variant="filled"
                      sx={{
                        padding: "0rem 0.3rem 0rem 0.3rem",
                        margin: "auto",
                        backgroundColor: JobTypeBGColor(objJob.JobType, theme),
                      }}
                    />
                  </MUITableCell>

                  <MUITableCell component="th" scope="row" align="center">
                    <HeaderSubtitle>
                      {objJob.currency + objJob.salary}
                    </HeaderSubtitle>
                  </MUITableCell>

                  <MUITableCell component="th" scope="row" align="center">
                    <HeaderSubtitle>
                      {DateFormatter.getInstance().formatToDDMMYYYY(
                        objJob.createdAt
                      )}
                    </HeaderSubtitle>
                  </MUITableCell>

                  <MUITableCell component="th" scope="row" align="center">
                    <Chip
                      label={objJob.status}
                      variant="filled"
                      sx={{
                        padding: "0rem 0.3rem 0rem 0.3rem",
                        margin: "auto",
                        backgroundColor: JobstatusBGColor(objJob.status, theme),
                      }}
                    />
                  </MUITableCell>

                  <MUITableCell component="th" scope="row" align="center">
                    <PreviewIcon
                      height={22}
                      width={22}
                      cursor={"pointer"}
                      onClick={() =>
                        navigate(
                          Path.job.jobDetail(
                            objJob.PropertyName,
                            objJob.PropertyID,
                            objJob.title,
                            objJob._id
                          )
                        )
                      }
                    />
                  </MUITableCell>
                </MUITableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </RootStyle>
    </Page>
  );
}

const RootStyle = styled(Box)(() => ({
  minHeight: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
}));

const HeaderWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  borderBottom: `1px solid ${theme.palette.border}`,
  justifyContent: "flex-start",
  paddingBottom: "10px",
}));

const HeaderTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.4rem",
  color: theme.palette.text.primary,
}));

const HeaderSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: "0.9rem",
  color: theme.palette.text.secondary,
  textWrap: "wrap",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

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

const JobTypeBGColor = (type: enumJobType, theme: Theme) => {
  switch (type) {
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
