import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import useAuth from "src/hooks/useAuth";
import { Booking, BookingListObj } from "src/ObjMgr/Booking";
import showMessage from "src/util/ShowMessage";

export default function BookingList() {
  const [Bookings, setBookings] = useState<BookingListObj[]>([]);
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
    Booking.GetAllBookingList(
      id,
      (res) => {
        console.log(res);
        // setBookings(res);
        Booking.GenerateInvoice(
          res[0]._id,
          id,
          (data) => {
            console.log(data);
          },
          (err) => {
            showMessage(err, "error", theme, () => {});
          }
        );
      },
      (err) => {
        showMessage(err, "error", theme, () => {});
      }
    );
  };
  return <div>BookingList</div>;
}
