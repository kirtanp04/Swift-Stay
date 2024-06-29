import mongoose, { Schema } from 'mongoose';
import { RoomClass } from './RoomModel';

export enum enumPropertyType {
    Hotel = 'Hotel',

    Resort = 'Resort',

    Apartment = 'Apartment',

    Bungalow = 'Bungalow'
}

export class PropertyClass {
    _id: string = '';
    adminID: any = '';
    name: string = '';
    propertyType: enumPropertyType = enumPropertyType.Hotel
    address: string = '';
    city: string = '';
    state: string = '';
    country: string = '';
    zipCode: string = '';
    phone: string = '';
    email: string = '';
    website: string = '';
    description: string = '';
    amenities: string[] = [];
    images: string[] = [];
    rooms: RoomClass[] = []
    createdAt: Date = new Date();
}

const PropertySchema = new Schema<PropertyClass>({
    adminID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: [true, 'Property name is required.'] },
    propertyType: { enum: [enumPropertyType.Hotel, enumPropertyType.Resort, enumPropertyType.Bungalow, enumPropertyType.Apartment], default: enumPropertyType.Hotel },
    address: { type: String, required: [true, 'Property address is required.'] },
    city: { type: String, required: [true, 'city is required.'] },
    state: { type: String, required: [true, 'state is required.'] },
    country: { type: String, required: [true, 'country is required.'] },
    zipCode: { type: String, required: [true, 'zip code is required.'] },
    phone: { type: String, required: [true, 'phone number is required.'] },
    email: { type: String, required: [true, 'email is required.'] },
    website: { type: String },
    description: { type: String },
    rooms: [{ type: Schema.Types.ObjectId, ref: 'Room' }],
    amenities: [String],
    images: [String],
    createdAt: { type: Date },
});

export const Property = mongoose.model<PropertyClass>('Property', PropertySchema);




// type: { type: String, enum: ['hotel', 'resort', 'apartment', 'bungalow'], required: true },
// name: { type: String, required: true },
// description: { type: String },
// location: {
//   address: { type: String },
//   city: { type: String },
//   state: { type: String },
//   country: { type: String }
// },
// // Common fields for all types
// rating: { type: Number },
// rooms: { type: Number },
// amenities: [{ type: String }],
// // Specific fields for each type
// // Example for 'hotel'
// stars: { type: Number },
// // Example for 'resort'
// activities: [{ type: String }],
// // Example for 'apartment'
// roomsDetails: [{
//   roomNumber: { type: Number },
//   price: { type: Number }
// }],
// // Example for 'bungalow'
// hasGarden: { type: Boolean },
// // Additional common fields
// createdAt: { type: Date, default: Date.now }
// });