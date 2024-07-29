import mongoose, { Schema } from "mongoose";
import { UserClass } from "./UserModel";
import { RoomClass } from "./RoomModel";
import { PropertyClass } from "./PropertyModel";


interface TGuest {
    adults: number
    childrens: number
}

export enum enumBookingStatus {
    booked = 'booked',
    checked_in = 'checked_in',
    checked_out = 'checked_out',
    cancelled = 'cancelled'
}

export class BookingDetails {
    property: PropertyClass = new PropertyClass()
    room: RoomClass = new RoomClass()
    checkInDate: Date = new Date()
    checkOutDate: Date = new Date()
    guests: TGuest = { adults: 1, childrens: 0 }
    totalPrice: number = 0
    status: enumBookingStatus = enumBookingStatus.booked
    bookedOn: Date = new Date()
}

export class BookingClass {
    _id: string = '';
    user: UserClass = new UserClass();
    bookingDetails: BookingDetails[] = []
}

const BookingSchema = new Schema<BookingClass>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookingDetails: [
        {
            property: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
            room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
            checkInDate: { type: Date, required: true },
            checkOutDate: { type: Date, required: true },
            guests: { type: Number, required: true },
            totalPrice: { type: Number, required: true },
            status: { type: String, enum: [enumBookingStatus.booked, enumBookingStatus.checked_in, enumBookingStatus.checked_out, enumBookingStatus.cancelled], default: enumBookingStatus.booked },
            bookedOn: { type: Date, default: Date.now }
        }
    ]
});

BookingSchema.index({ user: 1 })
export const Booking = mongoose.model<BookingClass>('Booking', BookingSchema);
