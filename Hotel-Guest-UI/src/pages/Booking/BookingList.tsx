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
import { useEffect, useState } from "react";
import { PDFIcon } from "src/assets/iconify";
import { MUITableCell, MUITableRow } from "src/components/mui/MUITable";
import Page from "src/components/Page";
import useAuth from "src/hooks/useAuth";
import { Booking, BookingListObj, PaymentStatus } from "src/ObjMgr/Booking";
import { enumRoomType } from "src/ObjMgr/Room";
import showLoading from "src/util/ShowLoading";
import showMessage from "src/util/ShowMessage";

export default function BookingList() {
  const [Bookings, setBookings] = useState<BookingListObj[] | null>(null);
  const {
    user: {
      userInfo: { id },
    },
  } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    LoadBookinList();
  }, []);

  const LoadBookinList = () => {
    showLoading(theme, true);
    Booking.GetAllBookingList(
      id,
      (res) => {
        setBookings(res);
        showLoading(theme, false);
      },
      (err) => {
        showMessage(err, "error", theme, () => {});
        showLoading(theme, false);
      }
    );
  };
  return (
    <Page title="My bookings">
      <RootStyle>
        <HeaderWrapper>
          <HeaderTitle>My Booking List</HeaderTitle>
        </HeaderWrapper>

        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: 700, width: "100%" }}
            aria-label="customized table"
          >
            <TableHead>
              <TableRow>
                <MUITableCell align="center">Property</MUITableCell>
                <MUITableCell align="center">Room Type</MUITableCell>
                <MUITableCell align="center">Check-In | Check-Out</MUITableCell>
                <MUITableCell align="center">Arrival Time</MUITableCell>
                <MUITableCell align="center">Payment Status</MUITableCell>
                <MUITableCell align="center">Total Paid</MUITableCell>
                <MUITableCell align="center">Booked On</MUITableCell>
                <MUITableCell align="center">Invoice</MUITableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Bookings !== null &&
                Bookings.map((objBooking) => (
                  <MUITableRow
                    key={objBooking._id}
                    sx={{
                      "& .MuiTableCell-body": {
                        height: 50,
                      },
                    }}
                  >
                    <MUITableCell component="th" scope="row" align="center">
                      <HeaderSubtitle>
                        {objBooking.property?.name}
                      </HeaderSubtitle>
                    </MUITableCell>

                    <MUITableCell component="th" scope="row" align="center">
                      <Chip
                        label={objBooking.room!.type}
                        color={getChipColor(objBooking.room!.type) as any}
                        variant="filled"
                        sx={{ margin: "auto" }}
                      />
                    </MUITableCell>

                    <MUITableCell component="th" scope="row" align="center">
                      <HeaderSubtitle>
                        {objBooking.stayInfo.checkIn} |{" "}
                        {objBooking.stayInfo.checkOut}
                      </HeaderSubtitle>
                    </MUITableCell>

                    <MUITableCell component="th" scope="row" align="center">
                      <HeaderSubtitle>
                        {objBooking.YourArrivalTime === ""
                          ? "-"
                          : objBooking.YourArrivalTime}
                      </HeaderSubtitle>
                    </MUITableCell>

                    <MUITableCell component="th" scope="row" align="center">
                      <Chip
                        label={objBooking.PaymentDetail.PaymentStatus}
                        color={
                          objBooking.PaymentDetail.PaymentStatus ===
                          PaymentStatus.fail
                            ? "error"
                            : objBooking.PaymentDetail.PaymentStatus ===
                              PaymentStatus.paid
                            ? "success"
                            : objBooking.PaymentDetail.PaymentStatus ===
                              PaymentStatus.pending
                            ? "warning"
                            : "default"
                        }
                        variant="filled"
                        sx={{ width: 70 }}
                      />
                    </MUITableCell>

                    <MUITableCell component="th" scope="row" align="center">
                      <HeaderSubtitle>{objBooking.totalPay}</HeaderSubtitle>
                    </MUITableCell>

                    <MUITableCell component="th" scope="row" align="center">
                      <HeaderSubtitle>{objBooking.BookingDate}</HeaderSubtitle>
                    </MUITableCell>

                    <MUITableCell component="th" scope="row" align="center">
                      {objBooking.invoice !== null ? (
                        <PDFIcon
                          height={28}
                          width={28}
                          cursor={"pointer"}
                          onClick={async () => {
                            try {
                              const response = await fetch(objBooking.invoice!);
                              const blob = await response.blob();
                              const url = URL.createObjectURL(blob);
                              window.open(url, "_blank");
                              setTimeout(() => URL.revokeObjectURL(url), 1000);
                            } catch (error) {
                              showMessage(
                                "Error opening PDF",
                                "error",
                                theme,
                                () => {}
                              );
                            }
                          }}
                        />
                      ) : (
                        <GenerateInvoice>
                          <HeaderSubtitle
                            sx={{ color: theme.palette.background.default }}
                          >
                            Generate
                          </HeaderSubtitle>
                        </GenerateInvoice>
                      )}
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

const GenerateInvoice = styled(Box)(({ theme }) => ({
  width: "90%",
  height: 30,
  borderRadius: "10px",
  cursor: "pointer",
  backgroundColor: theme.palette.color.warning.main,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "auto",
  padding: "10px",
}));

const HeaderSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: "0.9rem",
  color: theme.palette.text.secondary,
  textWrap: "wrap",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const getChipColor = (_RoomType: enumRoomType): string => {
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
