import mongoose, { Schema } from 'mongoose';
import { PropertyClass } from './PropertyModel';
import { UserClass } from './UserModel';


class SubscribeDetail {
    property: PropertyClass = new PropertyClass()
    users: UserClass[] = []
}

export class SubscriberClass {
    _id: string = '';
    adminID: string = '';
    SubscribeDetail: SubscribeDetail[] = []
}

const SubscriberSchema = new Schema<SubscriberClass>({

    adminID: { type: String, required: [true, 'Admin ID is required.'] },
    SubscribeDetail: [
        {
            property: { type: Schema.Types.ObjectId, ref: 'Property' },
            users: [
                { type: Schema.Types.ObjectId, ref: 'User' }
            ]
        }
    ]

});

SubscriberSchema.index({ adminID: 1 })

export const Subscriber = mongoose.model<SubscriberClass>('Subscriber', SubscriberSchema);
