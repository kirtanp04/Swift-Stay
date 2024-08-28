import { NextFunction, Request, Response } from 'express';
import { GetUserErrorObj, GetUserSuccessObj, HttpStatusCodes, UserResponse } from '../common';
import { Param } from '../Constant';
import { Booking, BookingClass } from '../models/BookingModel';
import { TParam } from '../types/Type';

// guest
const _GuestSaveBookingInfo = Param.function.guest.booking.SaveBookingInfo;
const _GuestUpdateBookingInfo = Param.function.guest.booking.UpdateBookingInfo;

export class BookingFunction {
    private static objUserResponse: UserResponse = new UserResponse();

    static findFunction = async (objParam: TParam, req: Request, res: Response, next: NextFunction): Promise<UserResponse> => {
        let _Function = new Functions();
        _Function.req = req;
        _Function.res = res;
        _Function.next = next;
        _Function.objParam = objParam;

        switch (objParam.function) {
            case _GuestSaveBookingInfo:
                this.objUserResponse = await _Function.SaveBooking();
                break;

            case _GuestUpdateBookingInfo:
                this.objUserResponse = await _Function.UpdateBooking();
                break;

            default:
                this.objUserResponse = GetUserErrorObj('Server error: Wronge Function.', HttpStatusCodes.BAD_REQUEST);
                break;
        }

        return this.objUserResponse;
    };
}

class Functions {
    private objUserResponse: UserResponse = new UserResponse();

    public req: Request | null = null;

    public res: Response | null = null;

    public next: NextFunction | null = null;

    public objParam: TParam = new TParam();

    public SaveBooking = async (): Promise<UserResponse> => {
        try {
            const objBooking: BookingClass = this.objParam.data;

            const _Booking = await Booking.create(objBooking);
            await _Booking.save();


            if (_Booking) {
                this.objUserResponse = GetUserSuccessObj('Success: booking info store in DB', HttpStatusCodes.OK);
            } else {
                this.objUserResponse = GetUserErrorObj('Fail to save initial data in DB', HttpStatusCodes.BAD_REQUEST);
            }
        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_REQUEST);
        } finally {
            return this.objUserResponse;
        }
    };

    public UpdateBooking = async (): Promise<UserResponse> => {
        try {
            const {
                CancleDate,
                OptionalInfo,
                PaymentDetail,
                UserInfo,
                YourArrivalTime,
                bookingStatus,
                stayInfo,
                ReasonForCancle,
                BookingDate,
                propertyID,
                roomID,
                totalPay,
                userID,

            }: BookingClass = this.objParam.data;



            const _Booking = await Booking.findOneAndUpdate(
                {
                    $and: [
                        {
                            propertyID: propertyID,
                        },
                        {
                            roomID: roomID,
                        },
                        {
                            userID: userID,
                        },
                        {
                            BookingDate: BookingDate,
                        },
                    ],
                },
                {
                    $set: {
                        CancleDate: CancleDate,
                        OptionalInfo: OptionalInfo,
                        PaymentDetail: PaymentDetail,
                        UserInfo: UserInfo,
                        YourArrivalTime: YourArrivalTime,
                        bookingStatus: bookingStatus,
                        stayInfo: stayInfo,
                        ReasonForCancle: ReasonForCancle,

                    },
                }
            );

            if (_Booking) {
                this.objUserResponse = GetUserSuccessObj('Success: booking info Updated', HttpStatusCodes.OK);
            }
        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_REQUEST);
        } finally {
            return this.objUserResponse;
        }
    };
}
