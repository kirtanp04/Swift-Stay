import mongoose, { Schema } from 'mongoose';
import { RoomClass } from './RoomModel';
import { UserClass } from './UserModel';
import { PropertyClass } from './PropertyModel';

export enum enumPropertyType {
    Hotel = 'Hotel',
    Resort = 'Resort',
    Apartment = 'Apartment',
    Bungalow = 'Bungalow'
}

class SubscribeDetail {
    property: PropertyClass = new PropertyClass()
    users: UserClass[] = []
}

export class SubscriberClass {
    _id: string = '';
    admin: UserClass = new UserClass();
    SubscribeDetail: SubscribeDetail[] = []
}

const SubscriberSchema = new Schema<SubscriberClass>({

    admin: { type: Schema.Types.ObjectId, ref: 'User' },
    SubscribeDetail: [
        {
            property: { type: Schema.Types.ObjectId, ref: 'Property' },
            users: [
                { type: Schema.Types.ObjectId, ref: 'User' }
            ]
        }
    ]

});

export const Subscriber = mongoose.model<SubscriberClass>('Subscriber', SubscriberSchema);
