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
    _id: string = '';
    name: string = '';
    email: string = '';
    password: string = '';
    profileImg: string = '';
    phone: string = '';
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
    password: {
        type: String,
        required: true,
    },
    profileImg: {
        type: String,
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
