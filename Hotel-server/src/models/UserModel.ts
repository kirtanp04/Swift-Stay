import mongoose, { Schema } from 'mongoose';

export enum enumUserRole {
    guest = 'guest',

    admin = 'admin'
}

export class Login {
    email: string = "";

    password: string = "";
}

export class UserClass {
    _id?: string = "";
    name: string = "";
    email: string = "";
    password: string = "";
    isEmailVerified: boolean = false;
    confirmPassword: string = "";
    country: string = '';
    profileImg: string = "";
    phone: string = "";
    role: enumUserRole = enumUserRole.guest;
    createdAt: Date = new Date();
}

const UserSchema = new Schema<UserClass>({
    name: {
        type: String,
        required: [true, 'Name is required.'],
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true,
    },
    profileImg: {
        type: String,
    },
    country: {
        type: String,
        required: [true, 'Country is required.'],
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: [enumUserRole.guest, enumUserRole.admin],
        required: true,
    },
    createdAt: {
        type: Date,
    },
});




export const User = mongoose.model<UserClass>('User', UserSchema);
