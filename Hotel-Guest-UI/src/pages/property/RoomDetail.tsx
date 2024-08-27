import {
  Box,
  Chip,
  Paper,
  Stack,
  styled,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import getSymbolFromCurrency from "currency-symbol-map";
import { useParams } from "react-router-dom";
import { PersonIcon, PreviewIcon } from "src/assets/iconify";
import EToolTip from "src/components/EToolTip";
import IfLogedin from "src/components/IfLogedin";
import LoginPopOver from "src/components/LoginPopOver";
import { MUITableCell, MUITableRow } from "src/components/mui/MUITable";
import { TRoom } from "src/ObjMgr/Property";
import { enumRoomType } from "src/ObjMgr/Room";
import { Path } from "src/Router/path";

type Props = {
  Rooms: TRoom[];
  currency: string;
};

export default function RoomDetail({ Rooms, currency }: Props) {
  const { propertyName, state, country, propertyID } = useParams();

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
              <MUITableRow key={row.type}>
                <MUITableCell component="th" scope="row">
                  <Stack
                    justifyContent={"center"}
                    alignItems={"center"}
                    position={"relative"}
                    sx={{ height: "100%", width: "100%" }}
                  >
                    <Chip
                      label={row.type}
                      color={getChipColor(row.type) as any}
                      variant="filled"
                      sx={{ margin: "auto" }}
                    />

                    <PreviewIcon
                      height={20}
                      width={20}
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        cursor: "pointer",
                      }}
                    />
                  </Stack>
                </MUITableCell>

                <MUITableCell align="left">
                  {row.roomInfo.map((objRoom) => (
                    <MUITableCell
                      align="left"
                      key={objRoom._id}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: !objRoom.isAvailable
                          ? theme.palette.color.rose.lighter
                          : null,
                      }}
                    >
                      <MaxOccupancyWrapper>
                        {createArray(objRoom.maxOccupancy).map((_, i) => (
                          <PersonIcon height={18} width={18} key={i} />
                        ))}
                      </MaxOccupancyWrapper>
                      <AmenitiesWrapper>
                        {objRoom.amenities.map((amen) => (
                          <SubTitle
                            key={amen}
                            sx={{
                              backgroundColor: theme.palette.color.info.main,
                              color: theme.palette.background.default,
                              padding: "0.2rem 0.5rem",
                              borderRadius: "5px",
                            }}
                          >
                            {amen}
                          </SubTitle>
                        ))}
                      </AmenitiesWrapper>
                    </MUITableCell>
                  ))}
                </MUITableCell>

                <MUITableCell align="left">
                  {row.roomInfo.map((objRoom) => (
                    <MUITableCell
                      align="left"
                      key={objRoom._id}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: !objRoom.isAvailable
                          ? theme.palette.color.rose.lighter
                          : null,
                      }}
                    >
                      <Box padding={"0.5rem 1rem"}>
                        <SubTitleHeader>
                          {getSymbolFromCurrency(currency)}
                          {objRoom.price}
                        </SubTitleHeader>
                        <SubTitle>Including all taxes</SubTitle>
                      </Box>
                    </MUITableCell>
                  ))}
                </MUITableCell>

                <MUITableCell align="left">
                  {row.roomInfo.map((objRoom) => (
                    <MUITableCell
                      align="left"
                      key={objRoom._id}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: !objRoom.isAvailable
                          ? theme.palette.color.rose.lighter
                          : null,
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          padding: "0.2rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                        }}
                      >
                        <SubTitle
                          sx={{
                            color: objRoom.isAvailable
                              ? theme.palette.color.success.main
                              : theme.palette.color.error.main,
                          }}
                        >
                          {objRoom.isAvailable ? "A" : "N"}
                        </SubTitle>
                      </Box>
                    </MUITableCell>
                  ))}
                </MUITableCell>

                <MUITableCell align="left">
                  {row.roomInfo.map((objRoom) => (
                    <MUITableCell
                      align="left"
                      key={objRoom._id}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: !objRoom.isAvailable
                          ? theme.palette.color.rose.lighter
                          : null,
                      }}
                    >
                      {objRoom.isAvailable ? (
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
                            onClick={() =>
                              window.open(
                                window.location.origin +
                                  Path.booking(
                                    country!,
                                    state!,
                                    propertyName!,
                                    propertyID!,
                                    objRoom._id,
                                    objRoom.type
                                  ),
                                "_blank"
                              )
                            }
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
                  ))}
                </MUITableCell>
              </MUITableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </RootStyle>
  );
}

export function createArray(length) {
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
  padding: "0.5rem 1rem",
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
  flexWrap: "wrap",
  gap: "5px",
  padding: "0.5rem 1rem",
}));

const BookNowButton = styled(Box)(({ theme }) => ({
  padding: "0.5rem 1rem",
  borderRadius: "10px",
  color: theme.palette.text.primary,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "60%",
  margin: "auto",
}));
