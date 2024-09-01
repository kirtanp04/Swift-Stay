import { Api, getGETParamData, getPostParamData } from "src/common/ApiCall";
import DateFormatter from "src/common/DateFormate";
import { Param } from "src/Constant";
import { Property } from "./Property";
import { Room } from "./Room";

export class Booking {
    _id: string = ''

    propertyID: string | null = null;

    roomID: string | null = null;

    userID: string | null = null;

    UserInfo: UserInfo = new UserInfo();

    stayInfo: StayInfo = new StayInfo();

    totalPay: string | null = null;

    bookingStatus: enumBookingStatus = enumBookingStatus.pending;

    PaymentDetail: PaymentDetail = new PaymentDetail()

    invoice: string | null = null

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

    static GetAllBookingList = async (
        userID: string,
        onsuccess: (res: any) => void,
        onfail: (err: any) => void
    ) => {
        try {
            const _Param = getGETParamData(
                Param.broker.booking,
                Param.function.booking.getMyBookingList,
                userID
            );
            await Api.protectedGet(_Param, (res) => {
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

    static GenerateInvoice = async (
        bookingID: string,
        userID: string,
        onsuccess: (res: any) => void,
        onfail: (err: any) => void
    ) => {

        debugger
        try {
            const _Param = getGETParamData(
                Param.broker.booking,
                Param.function.booking.generateInvoice,
                { bookingID: bookingID, userID: userID }
            );
            await Api.protectedGet(_Param, (res) => {
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

export interface BookingListObj extends Booking {
    property: Property | null
    room: Room | null
}

export enum enumBookingStatus {
    booked = "booked",
    checked_in = "checked_in",
    checked_out = "checked_out",
    cancelled = "cancelled",
    pending = 'pending',
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

    Session: string | null = null
}



export enum PaymentStatus {
    pending = 'pending',
    paid = 'paid',
    fail = 'fail'
}