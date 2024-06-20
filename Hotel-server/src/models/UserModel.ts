import mongoose, { Schema } from 'mongoose';

export class UserClass {
  _id: string = '';
  name: string = '';
  email: string = '';
  password: string = '';
  phone: string = '';
  provider: 'google' | 'OAuth' = 'OAuth'
  role: 'guest' | 'admin' = 'admin';
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
  provider: {
    type: String,
    enum: ['google', 'OAuth'],
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['guest', 'admin'],
    required: true,
  },
  createdAt: {
    type: Date,
  },
});




export const User = mongoose.model<UserClass>('User', UserSchema);
