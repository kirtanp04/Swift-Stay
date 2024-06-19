import mongoose, { Schema } from 'mongoose';

export class HotelClass {
    name: string = '';
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
    createdAt: Date = new Date();
}

const HotelSchema = new Schema<HotelClass>({
    name: { type: String, required: [true, 'Hotel name is required.'] },
    address: { type: String, required: [true, 'Hotel address is required.'] },
    city: { type: String, required: [true, 'city is required.'] },
    state: { type: String, required: [true, 'state is required.'] },
    country: { type: String, required: [true, 'country is required.'] },
    zipCode: { type: String, required: [true, 'zip code is required.'] },
    phone: { type: String, required: [true, 'phone number is required.'] },
    email: { type: String, required: [true, 'email is required.'] },
    website: { type: String },
    description: { type: String },
    amenities: [String],
    createdAt: { type: Date },
});

export const Hotel = mongoose.model<HotelClass>('Hotel', HotelSchema);
