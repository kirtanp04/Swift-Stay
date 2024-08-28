import { Api, getPostParamData } from "src/common/ApiCall";
import DateFormatter from "src/common/DateFormate";
import { Param } from "src/Constant";

export class Booking {
    propertyID: string | null = null;

    roomID: string | null = null;

    userID: string | null = null;

    UserInfo: UserInfo = new UserInfo();

    stayInfo: StayInfo = new StayInfo();

    totalPay: string | null = null;

    bookingStatus: enumBookingStatus = enumBookingStatus.pending;

    PaymentDetail: PaymentDetail = new PaymentDetail()

    OptionalInfo: OptionalInfo = new OptionalInfo();

    YourArrivalTime: string = "";

    BookingDate: string = DateFormatter.getInstance().formatToDDMMYYYY(new Date())

    CancleDate: string | null = null


    ReasonForCancle: string | null = null

    static CreateCheckOut = async (
        objBooking: Booking,
        onsuccess: (res: any) => void,
        onfail: (err: any) => void
    ) => {
        try {
            const _Param = getPostParamData(
                Param.broker.payment,
                Param.function.payment.CheckOut
            );
            await Api.protectedPost(_Param, objBooking, (res) => {
                if (res.error === "") {
                    onsuccess(res.data);
                } else {
                    onfail(res.error);
                }
            });
        } catch (error: any) {
            onfail(error.message);
        }
    };
}

class StayInfo {
    checkIn: string | null = null;

    checkOut: string | null = null;

    adults: number | null = null;

    childrens: number | null = null;

    totalStay: string | null = null;
}

class UserInfo {
    name: string = "";

    email: string = "";

    address: string = "";

    city: string = "";

    ZipCode: string = "";

    country: string = "";

    state: string = "";

    phone: number | null = null;
}

class OptionalInfo {
    WhoAreYouBookingFor: string = '';

    AreYouTravellingForWork: string = '';

    SpecialRequests: string = '';

    companyName: string = '';
}

class PaymentDetail {
    PaymentID: string | null = null

    failPaymentID: string | null = null

    PaymentStatus: PaymentStatus = PaymentStatus.pending

    description: string | null = null
}

export enum enumBookingStatus {
    booked = "booked",
    checked_in = "checked_in",
    checked_out = "checked_out",
    cancelled = "cancelled",
    pending = 'pending',
}

enum PaymentStatus {
    pending = 'pending',
    paid = 'paid',
    fail = 'fail'
}