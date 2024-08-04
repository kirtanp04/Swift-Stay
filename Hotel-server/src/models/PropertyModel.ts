import mongoose, { Schema } from 'mongoose';
import { RoomClass } from './RoomModel';
import { ReviewClass } from './Review';
import { SubscriberClass } from './Subscriber';

export enum enumPropertyType {
    Hotel = 'Hotel',
    Resort = 'Resort',
    Apartment = 'Apartment',
    Bungalow = 'Bungalow',
    Villa = 'Villa',
    Cottage = 'Cottage'
}

export class PropertyClass {
    _id: string = '';
    adminID: string = '';
    name: string = '';
    propertyType: enumPropertyType = enumPropertyType.Hotel;
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
    rooms: RoomClass[] = [];
    reviews: ReviewClass = new ReviewClass();
    subscribers: SubscriberClass = new SubscriberClass();
    jobHiring: boolean = false
    createdAt: Date = new Date();
    updatedAt: Date = new Date();
}

const PropertySchema = new Schema<PropertyClass>({
    adminID: { type: String, required: [true, 'Admin ID is required.'] },
    name: { type: String, required: [true, 'Property name is required.'] },
    propertyType: { type: String, enum: Object.values(enumPropertyType), default: enumPropertyType.Hotel },
    address: { type: String, required: [true, 'Property address is required.'] },
    city: { type: String, required: [true, 'City is required.'] },
    state: { type: String, required: [true, 'State is required.'] },
    country: { type: String, required: [true, 'Country is required.'] },
    zipCode: { type: String, required: [true, 'Zip code is required.'] },
    phone: { type: String, required: [true, 'Phone number is required.'] },
    email: { type: String, required: [true, 'Email is required.'] },
    website: { type: String },
    description: { type: String },
    rooms: [{ type: Schema.Types.ObjectId, ref: 'Room' }],
    reviews: { type: Schema.Types.ObjectId, ref: 'Review' },
    subscribers: { type: Schema.Types.ObjectId, ref: 'Subscriber' },
    amenities: [String],
    images: [String],
    jobHiring: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

PropertySchema.index({ adminID: 1 })

export const Property = mongoose.model<PropertyClass>('Property', PropertySchema);
