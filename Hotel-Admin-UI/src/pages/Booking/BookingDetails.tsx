import {
  Box,
  Chip,
  Divider,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { allExpanded, darkStyles, JsonView } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";
import Page from "src/components/Page";
import Scrollbar from "src/components/Scrollbar";
import LoadingSkeleton from "src/components/Skeleton";
import { enumRoomType } from "../room/DataObject";
import { BookingClass, enumBookingStatus, PaymentStatus } from "./Dataobject";
import showLoading from "src/util/ShowLoading";
import { useParams } from "react-router-dom";
import useAuth from "src/hooks/useAuth";
import showMessage from "src/util/ShowMessage";
import { Crypt } from "src/common/Crypt";

export default function BookingDetails() {
  const [BookingInfo, setBookinInfo] = useState<BookingClass>(
    new BookingClass()
  );

  const [PaymentSession, setPaymentSession] = useState<any>([{}]);
  const { bookingID } = useParams();
  const {
    user: {
      userInfo: { id },
    },
  } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    getUserBooking();
  }, [bookingID, id]);

  const getUserBooking = () => {
    showLoading(theme, true);

    BookingClass.getUserBookinDetail(
      bookingID!,
      id,
      (res: BookingClass) => {
        if (res.PaymentDetail.Session !== null) {
          const Session = Crypt.Decryption(res.PaymentDetail.Session);

          if (Session.error === "") {
            setPaymentSession(Session.data);
          }
        }
        setBookinInfo(res);
        showLoading(theme, false);
      },
      (err) => {
        showMessage(err, theme, () => {});
        showMessage(err, theme, () => {});
      }
    );
  };

  return (
    <Page title="Booking Details">
      <RootStyle>
        <LeftContentWrapper>
          <Scrollbar sx={{ height: "100%", width: "100%" }}>
            <HeaderWrapper>
              <LoadingSkeleton
                isLoading={BookingInfo._id !== "" ? false : true}
                sx={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "space-between",
                  display: "flex",
                }}
                variant="text"
              >
                <HeadingText>User Info</HeadingText>
              </LoadingSkeleton>
            </HeaderWrapper>

            <ContentGridWrapper>
              <TextWrapper>
                <TextSkeleton isLoading={BookingInfo._id !== "" ? false : true}>
                  <Label>Name :</Label>
                  <Text>{BookingInfo.UserInfo.name}</Text>
                </TextSkeleton>
              </TextWrapper>

              <TextWrapper>
                <TextSkeleton isLoading={BookingInfo._id !== "" ? false : true}>
                  <Label>Email :</Label>
                  <Text>{BookingInfo.UserInfo.email}</Text>
                </TextSkeleton>
              </TextWrapper>

              <TextWrapper>
                <TextSkeleton isLoading={BookingInfo._id !== "" ? false : true}>
                  <Label>Phone :</Label>
                  <Text>{BookingInfo.UserInfo.phone}</Text>
                </TextSkeleton>
              </TextWrapper>

              <TextWrapper>
                <TextSkeleton isLoading={BookingInfo._id !== "" ? false : true}>
                  <Label>Country :</Label>
                  <Text>{BookingInfo.UserInfo.country}</Text>
                </TextSkeleton>
              </TextWrapper>

              <TextWrapper>
                <TextSkeleton isLoading={BookingInfo._id !== "" ? false : true}>
                  <Label>State :</Label>
                  <Text>{BookingInfo.UserInfo.state}</Text>
                </TextSkeleton>
              </TextWrapper>

              <TextWrapper>
                <TextSkeleton isLoading={BookingInfo._id !== "" ? false : true}>
                  <Label>City :</Label>
                  <Text>{BookingInfo.UserInfo.city}</Text>
                </TextSkeleton>
              </TextWrapper>

              <TextWrapper>
                <TextSkeleton isLoading={BookingInfo._id !== "" ? false : true}>
                  <Label>Zipcode :</Label>
                  <Text>{BookingInfo.UserInfo.ZipCode}</Text>
                </TextSkeleton>
              </TextWrapper>

              <TextWrapper>
                <TextSkeleton isLoading={BookingInfo._id !== "" ? false : true}>
                  <Label>Address :</Label>
                  <Text>{BookingInfo.UserInfo.address}</Text>
                </TextSkeleton>
              </TextWrapper>
            </ContentGridWrapper>

            <HeaderWrapper>
              <LoadingSkeleton
                isLoading={BookingInfo._id !== "" ? false : true}
                sx={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "space-between",
                  display: "flex",
                }}
                variant="text"
              >
                <HeadingText>Property Info</HeadingText>
              </LoadingSkeleton>
            </HeaderWrapper>

            <ContentGridWrapper>
              <TextWrapper>
                <TextSkeleton isLoading={BookingInfo._id !== "" ? false : true}>
                  <Label>Property Name :</Label>
                  <Text>{BookingInfo.property.name}</Text>
                </TextSkeleton>
              </TextWrapper>

              <TextWrapper>
                <TextSkeleton isLoading={BookingInfo._id !== "" ? false : true}>
                  <Label>Room :</Label>
                  <Chip
                    label={BookingInfo.room.type}
                    variant={
                      theme.palette.mode === "light" ? "filled" : "outlined"
                    }
                    size="small"
                    sx={{
                      width: 120,
                    }}
                    color={getChipColor(BookingInfo.room.type) as any}
                  />
                </TextSkeleton>
              </TextWrapper>

              <TextWrapper>
                <TextSkeleton isLoading={BookingInfo._id !== "" ? false : true}>
                  <Label>Room Price :</Label>
                  <Text>
                    {BookingInfo.room.currency}
                    {BookingInfo.room.price}
                  </Text>
                </TextSkeleton>
              </TextWrapper>

              <TextWrapper>
                <TextSkeleton isLoading={BookingInfo._id !== "" ? false : true}>
                  <Label>Room no :</Label>
                  <Text>{BookingInfo.room.roomNumber}</Text>
                </TextSkeleton>
              </TextWrapper>

              <TextWrapper>
                <TextSkeleton isLoading={BookingInfo._id !== "" ? false : true}>
                  <Label>Address :</Label>
                  <Text>{BookingInfo.property.address}</Text>
                </TextSkeleton>
              </TextWrapper>

              <TextWrapper>
                <TextSkeleton isLoading={BookingInfo._id !== "" ? false : true}>
                  <Label>City :</Label>
                  <Text>{BookingInfo.property.city}</Text>
                </TextSkeleton>
              </TextWrapper>

              <TextWrapper>
                <TextSkeleton isLoading={BookingInfo._id !== "" ? false : true}>
                  <Label>State :</Label>
                  <Text>{BookingInfo.property.state}</Text>
                </TextSkeleton>
              </TextWrapper>

              <TextWrapper>
                <TextSkeleton isLoading={BookingInfo._id !== "" ? false : true}>
                  <Label>Country :</Label>
                  <Text>{BookingInfo.property.country}</Text>
                </TextSkeleton>
              </TextWrapper>
            </ContentGridWrapper>

            <HeaderWrapper>
              <LoadingSkeleton
                isLoading={BookingInfo._id !== "" ? false : true}
                sx={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "space-between",
                  display: "flex",
                }}
                variant="text"
              >
                <HeadingText>Booking Info</HeadingText>
              </LoadingSkeleton>
            </HeaderWrapper>

            <ContentGridWrapper>
              <TextWrapper>
                <TextSkeleton isLoading={BookingInfo._id !== "" ? false : true}>
                  <Label>Check In :</Label>
                  <Text>{BookingInfo.stayInfo.checkIn}</Text>
                </TextSkeleton>
              </TextWrapper>

              <TextWrapper>
                <TextSkeleton isLoading={BookingInfo._id !== "" ? false : true}>
                  <Label>Check Out :</Label>
                  <Text>{BookingInfo.stayInfo.checkOut}</Text>
                </TextSkeleton>
              </TextWrapper>

              <TextWrapper>
                <TextSkeleton isLoading={BookingInfo._id !== "" ? false : true}>
                  <Label>Total Nights :</Label>
                  <Text>{BookingInfo.stayInfo.totalStay}</Text>
                </TextSkeleton>
              </TextWrapper>

              <TextWrapper>
                <TextSkeleton isLoading={BookingInfo._id !== "" ? false : true}>
                  <Label>Adults :</Label>
                  <Text>{BookingInfo.stayInfo.adults}</Text>
                </TextSkeleton>
              </TextWrapper>

              <TextWrapper>
                <TextSkeleton isLoading={BookingInfo._id !== "" ? false : true}>
                  <Label>Childrens :</Label>
                  <Text>{BookingInfo.stayInfo.childrens}</Text>
                </TextSkeleton>
              </TextWrapper>

              <TextWrapper>
                <TextSkeleton isLoading={BookingInfo._id !== "" ? false : true}>
                  <Label>Status :</Label>

                  <Chip
                    label={BookingInfo.bookingStatus}
                    variant={
                      theme.palette.mode === "light" ? "filled" : "outlined"
                    }
                    size="small"
                    sx={{
                      width: 120,
                    }}
                    color={
                      getBookingStatusChipColor(
                        BookingInfo.bookingStatus
                      ) as any
                    }
                  />
                </TextSkeleton>
              </TextWrapper>
            </ContentGridWrapper>

            <HeaderWrapper>
              <LoadingSkeleton
                isLoading={BookingInfo._id !== "" ? false : true}
                sx={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "space-between",
                  display: "flex",
                }}
                variant="text"
              >
                <HeadingText>Payment Info</HeadingText>
              </LoadingSkeleton>
            </HeaderWrapper>

            <TextWrapper sx={{ width: "max-content" }}>
              <TextSkeleton isLoading={BookingInfo._id !== "" ? false : true}>
                <Label>ID :</Label>
                <Text>{BookingInfo.PaymentDetail.PaymentID}</Text>
              </TextSkeleton>
            </TextWrapper>

            <ContentGridWrapper sx={{ gridTemplateColumns: "repeat(2,1fr)" }}>
              <TextWrapper>
                <TextSkeleton isLoading={BookingInfo._id !== "" ? false : true}>
                  <Label>Total Pay :</Label>
                  <Text>
                    {BookingInfo.currency} {BookingInfo.totalPay}
                  </Text>
                </TextSkeleton>
              </TextWrapper>

              <TextWrapper>
                <TextSkeleton isLoading={BookingInfo._id !== "" ? false : true}>
                  <Label>Status :</Label>
                  <Chip
                    label={BookingInfo.PaymentDetail.PaymentStatus}
                    color={
                      getPaymentStatusChipColor(
                        BookingInfo.PaymentDetail.PaymentStatus
                      ) as any
                    }
                    variant={
                      theme.palette.mode === "light" ? "filled" : "outlined"
                    }
                    size="small"
                    sx={{ width: 120 }}
                  />
                </TextSkeleton>
              </TextWrapper>

              <TextWrapper>
                <TextSkeleton isLoading={BookingInfo._id !== "" ? false : true}>
                  <Label>Description :</Label>
                  <Text>{BookingInfo.PaymentDetail.description}</Text>
                </TextSkeleton>
              </TextWrapper>

              <TextWrapper>
                <TextSkeleton isLoading={BookingInfo._id !== "" ? false : true}>
                  <Label>Fail ID :</Label>
                  <Text>{BookingInfo.PaymentDetail.failPaymentID}</Text>
                </TextSkeleton>
              </TextWrapper>
            </ContentGridWrapper>
          </Scrollbar>
        </LeftContentWrapper>

        <Divider flexItem orientation="vertical" sx={{ margin: 0 }} />

        <RightContentWrapper>
          <HeaderWrapper>
            <LoadingSkeleton
              isLoading={BookingInfo._id !== "" ? false : true}
              sx={{
                width: "100%",
                height: "100%",
                justifyContent: "space-between",
                display: "flex",
              }}
              variant="text"
            >
              <HeadingText>Payment Session</HeadingText>
            </LoadingSkeleton>
          </HeaderWrapper>

          <JSONWrapper>
            <Scrollbar sx={{ height: "100%" }}>
              <JsonView
                data={PaymentSession}
                shouldExpandNode={allExpanded}
                style={darkStyles}
              />
            </Scrollbar>
          </JSONWrapper>
        </RightContentWrapper>
      </RootStyle>
    </Page>
  );
}

const RootStyle = styled(Box)(() => ({
  height: "100%",
  width: "100%",
  display: "flex",
  // padding: "0.5rem",
}));

const RightContentWrapper = styled(Box)(() => ({
  height: "100%",
  width: 350,
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
}));

const LeftContentWrapper = styled(Box)(() => ({
  height: "100%",
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
}));

const HeaderWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  // height: 30,
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: "0.7rem",
  paddingRight: "1rem",
}));

const HeadingText = styled(Typography)(({ theme }) => ({
  fontSize: "1.2rem",
  color: theme.palette.text.primary,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontWeight: 600,
  [theme.breakpoints.down("xs")]: {
    fontSize: "0.9rem",
  },
}));

const ContentGridWrapper = styled(Box)(({ theme }) => ({
  height: "100%",
  width: "100%",
  display: "grid",
  gridTemplateColumns: "repeat(3,1fr)",
  padding: "0.5rem",
  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "repeat(2,1fr)",
  },
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "repeat(1,1fr)",
  },
}));

const TextWrapper = styled(Box)(() => ({
  width: "100%",
  height: 50,
  display: "flex",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

const JSONWrapper = styled(Box)(() => ({
  height: "calc(100% - 80px)",
  display: "flex",
  padding: "0.5rem",
}));

const TextSkeleton = styled(LoadingSkeleton)(() => ({
  width: "100%",
  display: "flex",
  gap: "10px",
  height: "100%",
  alignItems: "center",
}));

const Label = styled(Typography)(({ theme }) => ({
  fontSize: "0.9rem",
  color: theme.palette.text.secondary,
  width: "7rem",
  textAlign: "end",
  textWrap: "wrap",
  [theme.breakpoints.down("md")]: {
    fontSize: "0.85rem",
  },
}));

const Text = styled(Typography)(({ theme }) => ({
  fontSize: "0.9rem",
  color: theme.palette.text.primary,
  textWrap: "wrap",
  //   overflow: "hidden",
  //   textOverflow: "ellipsis",
  //   whiteSpace: "nowrap",
  [theme.breakpoints.down("md")]: {
    fontSize: "0.85rem",
  },
}));

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
