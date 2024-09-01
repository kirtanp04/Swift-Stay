import { Box, Button, styled, useTheme } from "@mui/material";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { VisacardIcon } from "src/assets/iconify";
import DateFormatter from "src/common/DateFormate";
import FormProvider from "src/components/Form/FormProvider";
import Page from "src/components/Page";
import { SecretKey } from "src/env";
import useAuth from "src/hooks/useAuth";
import useUserSearch from "src/hooks/useUserSearch";
import { Booking } from "src/ObjMgr/Booking";
import { Property, TPropertydetail } from "src/ObjMgr/Property";
import { Room } from "src/ObjMgr/Room";
import showLoading from "src/util/ShowLoading";
import showMessage from "src/util/ShowMessage";
import BookinForm from "./BookinForm";
import BookinDetail from "./BookingDetail";
import { SubTitle } from "./CommonStyle";
import PriceSummary from "./PriceSummary";
import PropertyDetail from "./PropertyDetail";
import RoomDetails from "./RoomDetails";

type Props = {};

export default function Bookin({}: Props) {
  const [PropertDetail, setPropertyDetail] = useState<TPropertydetail>(
    new TPropertydetail()
  );
  const [RoomDetail, setRoomDetail] = useState<Room>(new Room());

  const { propertyName, state, country, propertyID, roomID } = useParams();
  const theme = useTheme();
  const {
    UserSearchObj: { checkInDate, checkOutDate, adults, children },
  } = useUserSearch();

  const {
    user: {
      userInfo: { id, email },
    },
  } = useAuth();

  const _Method = useForm<Booking>({
    defaultValues: getDefaultFormData(),
    // resolver: yupResolver(BookingFormSchema) as any,
  });
  const { handleSubmit } = _Method;

  useEffect(() => {
    Promise.all([getPropertyDetail(), getRoomDetail()])
      .then((res) => {
        setPropertyDetail(res[0] as any);
        setRoomDetail(res[1] as any);
      })
      .catch((err) => {
        showMessage(err, "error", theme, () => {});
      });
  }, [propertyName, state, country, propertyID, roomID]);

  const getRoomDetail = async () => {
    const room = await new Promise((resolve, reject) => {
      Room.getRoomDetail(
        roomID!,
        propertyID!,
        id,
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    });

    return room;
  };

  const getPropertyDetail = async () => {
    const property = await new Promise((resolve, reject) => {
      Property.GetSinglePropertyDetail(
        country!,
        state!,
        propertyName!,
        propertyID!,
        (res: TPropertydetail) => {
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    });

    return property;
  };

  const SaveBooking = async (objbooking: Booking) => {
    showLoading(theme, true);
    objbooking.propertyID = PropertDetail.propertyID;
    objbooking.roomID = RoomDetail._id;
    objbooking.totalPay =
      RoomDetail.currency +
      (
        RoomDetail.price *
        DateFormatter.getInstance().getDifferenceInDays(
          checkInDate!,
          checkOutDate!
        )
      ).toString();

    try {
      const stripe: Stripe | null = await loadStripe(
        SecretKey.stripe.publishableKey
      );

      if (stripe !== null) {
        Booking.CreateCheckOut(
          objbooking,
          async (res) => {
            console.log(res);
            const result = await stripe.redirectToCheckout({
              sessionId: res,
            });

            showLoading(theme, false);
            if (result.error) {
              showMessage(result.error.message!, "error", theme, () => {});
            }
          },
          (err) => {
            showMessage(err, "error", theme, () => {});
            showLoading(theme, false);
          }
        );
      } else {
        showMessage("Getting stripe null", "error", theme, () => {});
        showLoading(theme, false);
      }
    } catch (error: any) {
      showMessage(error, "error", theme, () => {});
      showLoading(theme, false);
    }
  };

  function getDefaultFormData(): Booking {
    const DefaultData = new Booking();
    DefaultData.UserInfo.email = email;
    DefaultData.userID = id;
    DefaultData.stayInfo.adults = adults;
    DefaultData.stayInfo.checkIn = DateFormatter.getInstance().formatToDDMMYYYY(
      checkInDate!
    ) as any;
    DefaultData.stayInfo.checkOut =
      DateFormatter.getInstance().formatToDDMMYYYY(checkOutDate!) as any;
    DefaultData.stayInfo.childrens = children;
    DefaultData.stayInfo.totalStay = `${DateFormatter.getInstance().getDifferenceInDays(
      checkInDate!,
      checkOutDate!
    )} nights`;

    return DefaultData;
  }

  return (
    <Page title={`Booking | ${propertyName}`}>
      <Rootstyle>
        <LeftContentWrapper>
          <PropertyDetail Property={PropertDetail} />
          <BookinDetail />
          <PriceSummary RoomDetail={RoomDetail} />
        </LeftContentWrapper>
        <RightContentWrapper>
          <FormProvider
            methods={_Method}
            onSubmit={handleSubmit(SaveBooking)}
            sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <ContentWrapper>
              <BookinForm _Method={_Method} />
            </ContentWrapper>

            <ContentWrapper>
              <RoomDetails RoomDetail={RoomDetail} />
            </ContentWrapper>

            <ContentWrapper
              sx={{
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <Box>
                <SubTitle>Pay with a Card</SubTitle>
                <VisacardIcon height={30} width={30} />
              </Box>
              <Button
                sx={{
                  color: theme.palette.background.default,
                }}
                variant="contained"
                type="submit"
              >
                Pay
              </Button>
            </ContentWrapper>
          </FormProvider>
        </RightContentWrapper>
      </Rootstyle>
    </Page>
  );
}

const Rootstyle = styled(Box)(() => ({
  minHeight: "100vh",
  width: "100%",
  display: "flex",
  gap: "10px",
}));

const LeftContentWrapper = styled(Box)(() => ({
  height: "100%",
  width: 350,
  display: "flex",
  flexDirection: "column",
  gap: "10px",
}));

const RightContentWrapper = styled(Box)(() => ({
  height: "100%",
  display: "flex",
  flex: 1,
  flexDirection: "column",
  gap: "5px",
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flex: 1,
  flexDirection: "column",
  gap: "5px",
  padding: "1rem",
  border: `1px solid ${theme.palette.border}`,
  borderRadius: "10px",
}));
