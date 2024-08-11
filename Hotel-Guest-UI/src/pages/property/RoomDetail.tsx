import {
  Box,
  Chip,
  Paper,
  styled,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { PersonIcon } from "src/assets/iconify";
import EToolTip from "src/components/EToolTip";
import IfLogedin from "src/components/IfLogedin";
import LoginPopOver from "src/components/LoginPopOver";
import { MUITableCell, MUITableRow } from "src/components/mui/MUITable";
import { enumRoomType, Room } from "src/ObjMgr/Room";

type Props = {
  Rooms: Room[];
};

export default function RoomDetail({ Rooms }: Props) {
  const theme = useTheme();
  return (
    <RootStyle>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <MUITableCell align="left">Room type</MUITableCell>
              <MUITableCell align="left">Number of guests</MUITableCell>
              <MUITableCell align="left">Price for 1 nights</MUITableCell>
              <MUITableCell align="left">Availability</MUITableCell>
              <MUITableCell align="left">Select rooms</MUITableCell>
              {/* <MUITableCell align="left">Protein&nbsp;(g)</MUITableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {Rooms.map((row) => (
              <MUITableRow key={row._id}>
                <MUITableCell component="th" scope="row">
                  <Chip
                    label={row.type}
                    color={getChipColor(row.type) as any}
                    variant="outlined"
                  />
                  <SubTitle>{row.description}</SubTitle>
                  <AmenitiesWrapper>
                    {row.amenities.map((amen) => (
                      <SubTitle
                        sx={{
                          padding: "0.1rem 0.2rem",
                          backgroundColor: theme.palette.background.neutral,
                          borderRadius: "4px",
                        }}
                        key={amen}
                      >
                        {amen}
                      </SubTitle>
                    ))}
                  </AmenitiesWrapper>
                </MUITableCell>

                <MUITableCell align="left">
                  <MaxOccupancyWrapper>
                    {createArray(row.maxOccupancy).map((_, i) => (
                      <PersonIcon height={18} width={18} key={i} />
                    ))}
                  </MaxOccupancyWrapper>
                </MUITableCell>

                <MUITableCell align="left">
                  <SubTitleHeader>{row.price}</SubTitleHeader>
                  <SubTitle>Including all taxes</SubTitle>
                </MUITableCell>

                <MUITableCell
                  align="left"
                  sx={{
                    backgroundColor: row.isAvailable
                      ? theme.palette.color.success.lighter
                      : theme.palette.color.error.lighter,
                  }}
                >
                  <SubTitleHeader
                    sx={{ color: theme.palette.background.default }}
                  >
                    {row.isAvailable ? "" : ""}
                  </SubTitleHeader>
                </MUITableCell>

                <MUITableCell align="left">
                  {row.isAvailable ? (
                    <IfLogedin
                      Else={
                        <>
                          <EToolTip
                            title={
                              <LoginPopOver
                                text={`You are not authorize. Please login to Swift Stay to Book ${row.type}`}
                              />
                            }
                          >
                            <BookNowButton
                              sx={{
                                backgroundColor: theme.themeColor,

                                cursor: "pointer",
                              }}
                            >
                              Book now
                            </BookNowButton>
                          </EToolTip>
                        </>
                      }
                    >
                      <BookNowButton
                        sx={{
                          backgroundColor: theme.themeColor,

                          cursor: "pointer",
                        }}
                      >
                        Book now
                      </BookNowButton>
                    </IfLogedin>
                  ) : (
                    <BookNowButton
                      sx={{
                        backgroundColor: theme.palette.background.neutral,
                        cursor: "not-allowed",
                      }}
                    >
                      Book now
                    </BookNowButton>
                  )}
                </MUITableCell>
              </MUITableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </RootStyle>
  );
}

function createArray(length) {
  return Array.from({ length }, (_, index) => index);
}

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

const RootStyle = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  width: "100%",
  marginTop: "1.2rem",
}));

const MaxOccupancyWrapper = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
}));

const SubTitleHeader = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  color: theme.palette.text.primary,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "flex",
  alignItems: "center",
  fontWeight: 700,
}));

const SubTitle = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  color: theme.palette.text.secondary,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "flex",
  alignItems: "center",
}));

const AmenitiesWrapper = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  width: "100%",
  marginTop: "0.5rem",
  flexWrap: "wrap",
  gap: "5px",
}));

const BookNowButton = styled(Box)(({ theme }) => ({
  padding: " 0.5rem",
  borderRadius: "10px",
  color: theme.palette.text.primary,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));
