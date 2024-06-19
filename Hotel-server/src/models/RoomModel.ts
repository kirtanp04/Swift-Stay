import mongoose, { Schema } from 'mongoose';
import { HotelClass } from './HotelModel';

export class RoomClass {
    hotel: HotelClass = new HotelClass()
    roomNumber: string = ''
    type: string = '' // e.g., single, double, suite
    description: string = ''
    amenities: string[] = []
    price: number = 0
    maxOccupancy: number = 0
    createdAt: Date = new Date()
}

const RoomSchema = new Schema<RoomClass>({
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    roomNumber: { type: String, required: [true, 'Hotel room number is required'] },
    type: { type: String, required: [true, ' Room type is required'] }, // e.g., single, double, suite
    description: { type: String },
    amenities: [String],
    price: { type: Number, required: [true, 'Room price is required'] },
    maxOccupancy: { type: Number, required: [true, 'Room max occupancy is required'] },
    createdAt: { type: Date }
});

export const Room = mongoose.model<RoomClass>('Room', RoomSchema);
