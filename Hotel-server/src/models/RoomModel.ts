import mongoose, { Schema } from 'mongoose';
import { PropertyClass } from './PropertyModel';


export class RoomClass {
    _id: string = '';
    property: PropertyClass = new PropertyClass()
    roomNumber: string = ''
    type: string = '' // e.g., single, double, suite
    description: string = ''
    amenities: string[] = []
    price: number = 0
    maxOccupancy: number = 0
    isAvailable: boolean = true
    createdAt: Date = new Date()
}

const RoomSchema = new Schema<RoomClass>({
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true }, // propertyID will inserted
    roomNumber: { type: String, required: [true, 'Property room number is required'] },
    type: { type: String, required: [true, ' Room type is required'] }, // e.g., single, double, suite
    description: { type: String },
    amenities: [String],
    price: { type: Number, required: [true, 'Room price is required'] },
    maxOccupancy: { type: Number, required: [true, 'Room max occupancy is required'] },
    isAvailable: { type: Boolean, default: true },
    createdAt: { type: Date }
});

export const Room = mongoose.model<RoomClass>('Room', RoomSchema);
