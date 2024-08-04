import mongoose, { Schema } from 'mongoose';
import { PropertyClass } from './PropertyModel';
import { UserClass } from './UserModel';


export class SubscriberClass {
    _id: string = '';
    property: PropertyClass = new PropertyClass();
    adminID: UserClass = new UserClass()
    subscribers: UserClass[] = []

}

const SubscriberSchema = new Schema<SubscriberClass>({

    adminID: { type: String, required: [true, 'Admin ID is required.'] },
    property: { type: Schema.Types.ObjectId, ref: 'Property' },
    subscribers: [
        { type: Schema.Types.ObjectId, ref: 'User' }
    ]

});

SubscriberSchema.index({ adminID: 1 })

export const Subscriber = mongoose.model<SubscriberClass>('Subscriber', SubscriberSchema);
