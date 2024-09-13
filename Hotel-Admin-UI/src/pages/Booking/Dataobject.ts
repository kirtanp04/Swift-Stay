import { Api, getGETParamData } from "src/common/ApiCall";
import { PropertyClass } from "../Property/DataObject";
import { RoomClass } from "../room/DataObject";
import { Param } from "src/Constant";
import { StoreError } from "src/util/StoreError";

export enum enumBookingStatus {
    pending = "pending",
    booked = "booked",
    checked_in = "checked_in",
    checked_out = "checked_out",
    cancelled = "cancelled",
}

export enum PaymentStatus {
    pending = "pending",
    paid = "paid",
    fail = "fail",
}

export class BookingClass {
    _id: string = "";

    propertyID: string = "";

    roomID: string = "";

    userID: string = "";

    adminID: string = "";

    UserInfo: UserInfo = new UserInfo();

    stayInfo: StayInfo = new StayInfo();

    totalPay: number | null = null;

    currency: string = "";

    bookingStatus: enumBookingStatus = enumBookingStatus.pending;

    PaymentDetail: PaymentDetail = new PaymentDetail();

    invoice: string | null = null;

    OptionalInfo: OptionalInfo = new OptionalInfo();

    YourArrivalTime: string = "";

    BookingDate: string = "";

    CancleDate: string | null = null;

    ReasonForCancle: string | null = null;

    property: PropertyClass = new PropertyClass();

    room: RoomClass = new RoomClass();

    static getbookinList = async (
        adminID: string,
        onsuccess: (res: any) => void,
        onFail: (err: any) => void,
        onProgress?: (progressValue: number) => void
    ) => {
        try {
            const _Param = getGETParamData(
                Param.broker.manager.booking,
                Param.function.manager.booking.GetBookingListByAdmin,
                adminID
            );

            await Api.protectedGet(
                _Param,
                (res) => {
                    if (res.error === "") {
                        onsuccess(res.data);
                    } else {
                        StoreError("Getting All bookings", res.error);
                        onFail(res.error);
                    }
                },
                (progressValue) => {
                    if (onProgress !== undefined) {
                        onProgress(progressValue);
                    }
                }
            );
        } catch (error: any) {
            StoreError("Getting All bookings", error.message);
            onFail(error.message);
        }
    };

    static getUserBookinDetail = async (
        bookingID: string,
        adminID: string,
        onsuccess: (res: any) => void,
        onFail: (err: any) => void,
    ) => {
        try {
            const _Param = getGETParamData(
                Param.broker.manager.booking,
                Param.function.manager.booking.GetUserBookingDetail,
                { adminID: adminID, BookingID: bookingID }
            );

            await Api.protectedGet(
                _Param,
                (res) => {
                    if (res.error === "") {
                        onsuccess(res.data);
                    } else {
                        StoreError("Getting All bookings", res.error);
                        onFail(res.error);
                    }
                },

            );
        } catch (error: any) {
            StoreError("Getting All bookings", error.message);
            onFail(error.message);
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
    WhoAreYouBookingFor: string = "";

    AreYouTravellingForWork: string = "";

    SpecialRequests: string = "";

    companyName: string = "";
}

class PaymentDetail {
    PaymentID: string | null = null;

    failPaymentID: string | null = null;

    PaymentStatus: PaymentStatus = PaymentStatus.pending;

    description: string | null = null;

    Session: string | null = null;
}
