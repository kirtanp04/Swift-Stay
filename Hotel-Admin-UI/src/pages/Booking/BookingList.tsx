import { Box, Button, Chip, styled, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { RefreshIcon } from "src/assets/iconify";
import GridHeader from "src/components/GridHeader";
import { MUIDataGrid } from "src/components/mui/MUIDataGrid";
import Page from "src/components/Page";
import useAuth from "src/hooks/useAuth";
import { BookingClass, enumBookingStatus, PaymentStatus } from "./Dataobject";
import showMessage from "src/util/ShowMessage";
import { enumRoomType } from "../room/DataObject";
import showLoading from "src/util/ShowLoading";

export default function BookingList() {
  const [BookingList, setBookingList] = useState<BookingClass[]>([]);
  const theme = useTheme();
  const {
    user: {
      userInfo: { id },
    },
  } = useAuth();

  useEffect(() => {
    getBookingList();
  }, []);

  const getBookingList = () => {
    showLoading(theme, true);
    BookingClass.getbookinList(
      id,
      (res) => {
        setBookingList(res);
        showLoading(theme, false);
      },
      (err) => {
        showMessage(err, theme, () => {});
        showLoading(theme, false);
      }
    );
  };

  return (
    <Page title="Property">
      <RootStyle>
        <GridHeader>
          <Button
            onClick={getBookingList}
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
          rows={BookingList}
          columns={[
            {
              field: "_id",
              headerName: "ID",
              flex: 1,
            },
            {
              field: "userName",
              headerName: "User Name",
              width: 150,
              renderCell: (param: any) => (
                <TextWrapper>
                  <Text>{param.row.UserInfo.name}</Text>
                </TextWrapper>
              ),
            },
            {
              field: "userEmail",
              headerName: "User Email",
              width: 200,
              renderCell: (param: any) => (
                <TextWrapper>
                  <Text>{param.row.UserInfo.email}</Text>
                </TextWrapper>
              ),
            },
            {
              field: "bookingstatus",
              headerName: "Booking Statue",
              width: 150,
              renderCell: (param: any) => (
                <TextWrapper>
                  <Chip
                    label={param.row.bookingStatus}
                    color={
                      getBookingStatusChipColor(param.row.bookingStatus) as any
                    }
                    variant="filled"
                    size="small"
                    sx={{ width: 120 }}
                  />
                </TextWrapper>
              ),
            },
            {
              field: "paymentStatus",
              headerName: "Payment Statue",
              width: 150,
              renderCell: (param: any) => (
                <TextWrapper>
                  <Chip
                    label={param.row.PaymentDetail.PaymentStatus}
                    color={
                      getPaymentStatusChipColor(
                        param.row.PaymentDetail.PaymentStatus
                      ) as any
                    }
                    variant="outlined"
                    size="small"
                    sx={{ width: 120 }}
                  />
                </TextWrapper>
              ),
            },
            {
              field: "totalpay",
              headerName: "Total Pay",
              width: 100,
              renderCell: (param: any) => (
                <TextWrapper>
                  <Text sx={{ color: theme.palette.color.warning.main }}>
                    {param.row.currency + ` ${param.row.totalPay}`}
                  </Text>
                </TextWrapper>
              ),
            },
            {
              field: "property",
              headerName: "Property",
              width: 250,
              renderCell: (param: any) => (
                <TextWrapper>
                  <Text>
                    {param.row.property.name +
                      ` ( ${param.row.property.state} )`}
                  </Text>
                </TextWrapper>
              ),
            },
            {
              field: "room",
              headerName: "Room",
              width: 150,
              renderCell: (param: any) => (
                <TextWrapper>
                  <Chip
                    label={param.row.room.type}
                    color={getChipColor(param.row.room.type) as any}
                    variant="filled"
                    size="small"
                    sx={{ width: 120 }}
                  />
                </TextWrapper>
              ),
            },
            {
              field: "Checkin/checkOut",
              headerName: "Check-In - Check-out",
              width: 200,
              renderCell: (param: any) => (
                <TextWrapper>
                  <Text>
                    {param.row.stayInfo.checkIn +
                      " - " +
                      param.row.stayInfo.checkOut}
                  </Text>
                </TextWrapper>
              ),
            },
            {
              field: "totalnights",
              headerName: "Total nights",
              width: 100,
              renderCell: (param: any) => (
                <TextWrapper>
                  <Text>{param.row.stayInfo.totalStay}</Text>
                </TextWrapper>
              ),
            },
            {
              field: "member",
              headerName: "Total Guest",
              width: 200,
              renderCell: (param: any) => (
                <TextWrapper>
                  <Text>
                    {param.row.stayInfo.adults +
                      " adults" +
                      " - " +
                      param.row.stayInfo.childrens +
                      " childrens"}
                  </Text>
                </TextWrapper>
              ),
            },

            {
              field: "bookedOn",
              headerName: "Booked on",
              width: 120,
              renderCell: (param: any) => (
                <TextWrapper>
                  <Text>{param.row.BookingDate}</Text>
                </TextWrapper>
              ),
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
  textAlign: "start",
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

const getBookingStatusChipColor = (status: enumBookingStatus): string => {
  let color: string = "";

  if (status === enumBookingStatus.booked) {
    color = "success";
  }
  if (status === enumBookingStatus.cancelled) {
    color = "error";
  }
  if (status === enumBookingStatus.checked_in) {
    color = "primary";
  }
  if (status === enumBookingStatus.checked_out) {
    color = "secondary";
  }
  if (status === enumBookingStatus.pending) {
    color = "warning";
  }

  return color;
};

const getPaymentStatusChipColor = (status: PaymentStatus): string => {
  let color: string = "";

  if (status === PaymentStatus.paid) {
    color = "success";
  }
  if (status === PaymentStatus.fail) {
    color = "error";
  }
  if (status === PaymentStatus.pending) {
    color = "warning";
  }

  return color;
};
