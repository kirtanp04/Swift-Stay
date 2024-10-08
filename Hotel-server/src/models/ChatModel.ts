import mongoose, { Schema } from 'mongoose';
import { ChatObj } from '../types/Type';





export class TChat {
    key: string = '';

    chatInfo: ChatObj[] = [];
}

const ChatSchema = new Schema<TChat>({
    key: { type: String, required: [true, 'Chat key is required.'] },
    chatInfo: [{
        key: { type: String, required: [true, 'Chat key is required.'] },
        message: { type: String, required: [true, 'Message is required.'] },
        date: { type: Date, required: [true, 'Date is required.'] },
        senderDetail: {
            _id: { type: String, required: [true, 'Sender Id is required.'] },
            email: { type: String, required: [true, 'Sender Email is required.'] },
            name: { type: String, required: [true, 'Sender Name is required.'] },
            role: { type: String, required: [true, 'Sender Role is required.'] },
            profileImg: { type: String },
        },
    }]
});

ChatSchema.index({ key: 1 });

export const Chat = mongoose.model('chat', ChatSchema);
