import mongoose, { Schema } from 'mongoose';

export enum enumBookingStatus {
    pending = 'pending',
    booked = 'booked',
    checked_in = 'checked_in',
    checked_out = 'checked_out',
    cancelled = 'cancelled',
}

export enum PaymentStatus {
    pending = 'pending',
    paid = 'paid',
    fail = 'fail',
}

export class BookingClass {
    propertyID: string = '';

    roomID: string = '';

    userID: string = '';

    UserInfo: UserInfo = new UserInfo();

    stayInfo: StayInfo = new StayInfo();

    totalPay: string | null = null;

    bookingStatus: enumBookingStatus = enumBookingStatus.pending;

    PaymentDetail: PaymentDetail = new PaymentDetail()

    OptionalInfo: OptionalInfo = new OptionalInfo();

    YourArrivalTime: string = '';

    BookingDate: string = '';

    CancleDate: string | null = null;

    ReasonForCancle: string | null = null

}

const BookingSchema = new Schema<BookingClass>({
    propertyID: { type: String, required: [true, 'Property is required.'] },
    roomID: { type: String, required: [true, 'Room is required.'] },
    userID: { type: String, required: [true, 'User is required.'] },
    UserInfo: {
        name: { type: String, required: [true, 'User name is required.'] },
        email: { type: String, required: [true, 'User email is required.'] },
        address: { type: String, required: [true, 'User address is required.'] },
        city: { type: String, required: [true, 'User city is required.'] },
        ZipCode: { type: String, required: [true, 'User ZipCode is required.'] },
        country: { type: String, required: [true, 'User country is required.'] },
        state: { type: String, required: [true, 'User state is required.'] },
        phone: { type: Number, required: [true, 'User phone is required.'] },
    },
    stayInfo: {
        checkIn: { type: String, required: [true, 'User checkIn is required.'] },
        checkOut: { type: String, required: [true, 'User checkOut is required.'] },
        adults: { type: Number, required: [true, 'User adults is required.'] },
        childrens: { type: Number, required: [true, 'User childrens is required.'] },
        totalStay: { type: String, required: [true, 'User totalStay is required.'] },
    },
    totalPay: { type: String, required: [true, 'Total payment getting empty is required.'] },
    bookingStatus: { type: String },
    PaymentDetail: {
        PaymentID: { type: String || null, default: null },
        failPaymentID: { type: String || null, default: null },
        PaymentStatus: { type: String, enum: Object.values(PaymentStatus) },
        description: { type: String || null, default: null },
    },
    OptionalInfo: {
        WhoAreYouBookingFor: { type: String },
        AreYouTravellingForWork: { type: String },
        SpecialRequests: { type: String },
        companyName: { type: String },
    },
    YourArrivalTime: { type: String },
    BookingDate: { type: String },
    CancleDate: { type: String || null, default: null },
    ReasonForCancle: { type: String || null, default: null },
});

BookingSchema.index({ userID: 1 });

export const Booking = mongoose.model<BookingClass>('Booking', BookingSchema);

class StayInfo {
    checkIn: string | null = null;

    checkOut: string | null = null;

    adults: number | null = null;

    childrens: number | null = null;

    totalStay: string | null = null;
}

class UserInfo {
    name: string = '';

    email: string = '';

    address: string = '';

    city: string = '';

    ZipCode: string = '';

    country: string = '';

    state: string = '';

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