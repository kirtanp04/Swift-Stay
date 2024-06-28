import mongoose, { Schema } from 'mongoose';
import { PropertyClass } from './HotelModel';


export class RoomClass {
    _id: string = '';
    hotel: PropertyClass = new PropertyClass()
    roomNumber: string = ''
    type: string = '' // e.g., single, double, suite
    description: string = ''
    amenities: string[] = []
    price: number = 0
    maxOccupancy: number = 0
    createdAt: Date = new Date()
}

const RoomSchema = new Schema<RoomClass>({
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    roomNumber: { type: String, required: [true, 'Property room number is required'] },
    type: { type: String, required: [true, ' Room type is required'] }, // e.g., single, double, suite
    description: { type: String },
    amenities: [String],
    price: { type: Number, required: [true, 'Room price is required'] },
    maxOccupancy: { type: Number, required: [true, 'Room max occupancy is required'] },
    createdAt: { type: Date }
});

export const Room = mongoose.model<RoomClass>('Room', RoomSchema);


// propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
// roomNumber: { type: String, required: true },
// type: { type: String, required: true }, // e.g., single, double, suite
// description: { type: String },
// capacity: { type: Number, default: 2 }, // maximum occupancy
// price: { type: Number, required: true },
// amenities: [{ type: String }],
// isAvailable: { type: Boolean, default: true },