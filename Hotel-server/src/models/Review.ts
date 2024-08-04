import mongoose, { Schema } from "mongoose";
import { PropertyClass } from "./PropertyModel";
import { UserClass } from "./UserModel";


export class ReviewInfo {
    user: UserClass = new UserClass()
    message: string = ''
    rating: number = 0
    createAt: Date = new Date()
}

export class ReviewClass {
    _id: string = ''
    property: PropertyClass = new PropertyClass()
    reviewInfo: ReviewInfo[] = []
}

const ReviewSchema = new Schema<ReviewClass>({
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    reviewInfo: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            message: { type: String },
            rating: { type: Number, max: 5 },
            createAt: { type: Date, default: Date.now }
        }
    ]
});

ReviewSchema.index({ property: 1 })

export const Review = mongoose.model('Review', ReviewSchema);

