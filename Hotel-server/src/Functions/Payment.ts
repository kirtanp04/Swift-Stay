import { NextFunction, Request, Response } from 'express';
import Stripe from 'stripe';
import { Crypt, GetUserErrorObj, GetUserSuccessObj, HttpStatusCodes, ProjectResponse, UserResponse } from '../common';
import { EmailTemplate, Param } from '../Constant';
import { SecrtKey } from '../env';
import { checkGuestVerification } from '../middleware/GuestVerification';
import { BookingClass, enumBookingStatus, PaymentStatus } from '../models/BookingModel';
import { Property } from '../models/PropertyModel';
import { Room, RoomClass } from '../models/RoomModel';
import { User } from '../models/UserModel';
import { Email } from '../service/Email';
import { TParam } from '../types/Type';
import { BookingFunction } from './Booking';

// guest
const _GuestCheckOut = Param.function.guest.payment.CheckOut;
const _GuestWebHook = Param.function.guest.payment.WebHook;
const _GuestUPIPayment = Param.function.guest.payment.UPIPayment;

export class PaymentFunction {
    private static objUserResponse: UserResponse = new UserResponse();

    static findFunction = async (objParam: TParam, req: Request, res: Response, next: NextFunction): Promise<UserResponse> => {
        let _Function = new Functions();
        _Function.req = req;
        _Function.res = res;
        _Function.next = next;
        _Function.objParam = objParam;

        switch (objParam.function) {
            case _GuestCheckOut:
                this.objUserResponse = await _Function.PaymentCheckOut();
                break;
            case _GuestWebHook:
                this.objUserResponse = await _Function.webhookHandler();
                break;

            case _GuestUPIPayment:
                this.objUserResponse = await _Function.UPIPayment();
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

    public PaymentCheckOut = async (): Promise<UserResponse> => {
        try {
            const bookingInfo: BookingClass = this.objParam.data;

            const isVerified = await checkGuestVerification(bookingInfo.userID);

            if (isVerified.error === '') {
                const PropertyDetail = await Property.findOne({ _id: bookingInfo.propertyID });

                const encryptedMetaData: any[] = splitIntoFourParts(Crypt.Encryption(bookingInfo).data);

                if (PropertyDetail !== undefined) {
                    try {
                        const _Stripe = new Stripe(SecrtKey.STRIPE.SECRET_KEY);
                        const Session = await _Stripe.checkout.sessions.create({
                            payment_method_types: ['card'],
                            mode: 'payment',
                            success_url: SecrtKey.FRONTEND_URL.GUEST,
                            cancel_url: SecrtKey.FRONTEND_URL.GUEST,
                            line_items: [
                                {
                                    price_data: {
                                        currency: 'inr',
                                        product_data: {
                                            name: PropertyDetail?.name as string,
                                            description: PropertyDetail?.description,
                                            images: PropertyDetail?.images.length! > 0 ? PropertyDetail?.images : undefined,
                                        },
                                        unit_amount: bookingInfo.totalPay! * 100,
                                    },
                                    quantity: 1,
                                },
                            ],
                            metadata: {
                                key_1: encryptedMetaData[0],
                                key_2: encryptedMetaData[1],
                                key_3: encryptedMetaData[2],
                                key_4: encryptedMetaData[3],
                            },
                        });
                        const _Param = new TParam();
                        _Param.Broker = Param.broker.guest.booking;
                        _Param.function = Param.function.guest.booking.SaveBookingInfo;

                        bookingInfo.PaymentDetail.PaymentStatus = PaymentStatus.pending;
                        bookingInfo.totalPay = Session.amount_total! / 100;
                        bookingInfo.bookingStatus = enumBookingStatus.pending;

                        _Param.data = bookingInfo;

                        const _res = await BookingFunction.findFunction(_Param, this.req!, this.res!, this.next!);

                        if (!_res.isError) {
                            this.objUserResponse = GetUserSuccessObj(Session.id, HttpStatusCodes.OK);
                        } else {
                            this.objUserResponse = GetUserErrorObj(_res.Message, HttpStatusCodes.BAD_REQUEST);
                        }
                    } catch (error: any) {
                        this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_REQUEST);
                    }
                } else {
                    this.objUserResponse = GetUserErrorObj(
                        'The property of which you are booking is not available.',
                        HttpStatusCodes.NOT_ACCEPTABLE
                    );
                }
            } else {
                this.objUserResponse = GetUserErrorObj(isVerified.error, HttpStatusCodes.NOT_ACCEPTABLE);
            }
        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_REQUEST);
        } finally {
            return this.objUserResponse;
        }
    };

    public webhookHandler = async (): Promise<UserResponse> => {
        try {
            const stripe = new Stripe(SecrtKey.STRIPE.SECRET_KEY);
            const payloadString = JSON.stringify(this.objParam.data, null, 2);
            const signature = this.req!.headers['stripe-signature'] as string;

            const header = stripe.webhooks.generateTestHeaderString({
                payload: payloadString,
                secret: SecrtKey.STRIPE.WEBHOOK_SECRET,
                // signature: signature
            });

            try {
                const event = stripe.webhooks.constructEvent(payloadString, header, SecrtKey.STRIPE.WEBHOOK_SECRET);

                if (event.type === 'checkout.session.completed') {
                    try {
                        const paymentIntent = event.data.object as Stripe.Checkout.Session;
                        const _metadata = paymentIntent.metadata;
                        const _EncryptBookingInfo = _metadata!.key_1 + _metadata!.key_2 + _metadata!.key_3 + _metadata!.key_4;
                        let _bookingInfo: BookingClass = Crypt.Decryption(_EncryptBookingInfo).data;

                        const _Param = new TParam();
                        _Param.Broker = Param.broker.guest.booking;
                        _Param.function = Param.function.guest.booking.UpdateBookingInfo;

                        _bookingInfo.PaymentDetail.PaymentID = paymentIntent.id;
                        _bookingInfo.PaymentDetail.PaymentStatus = PaymentStatus.paid;
                        _bookingInfo.PaymentDetail.description = 'Payment was successfully done';
                        _bookingInfo.PaymentDetail.Session = Crypt.Encryption(paymentIntent).data;
                        _bookingInfo.bookingStatus = enumBookingStatus.booked;

                        _Param.data = _bookingInfo;
                        const _res = await BookingFunction.findFunction(_Param, this.req!, this.res!, this.next!);

                        if (!_res.isError) {
                            const user = await User.findOne({ _id: _bookingInfo.userID });
                            const room = await Room.findOne({ _id: _bookingInfo.roomID }).populate('property').exec();

                            if (room && user) {
                                const _Email = new Email({});

                                _Email.from = room.property.name;
                                _Email.to = user.email;
                                _Email.subject = 'Success for Booking' + ' ' + room.property.name;
                                _Email.html = EmailTemplate.Successbooking({
                                    objBooking: _bookingInfo,
                                    objRoom: room,
                                });
                                await _Email.sendEmail(
                                    () => { },
                                    (err) => {
                                        this.objUserResponse = GetUserErrorObj(err, HttpStatusCodes.BAD_REQUEST);
                                    }
                                );
                            }
                        }
                    } catch (error: any) {
                        this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_REQUEST);
                    }
                }

                if (event.type === 'checkout.session.async_payment_failed') {
                    const failedPaymentIntent = event.data.object as Stripe.Checkout.Session;
                    const failed_metadata = failedPaymentIntent.metadata;
                    const failed_EncryptBookingInfo =
                        failed_metadata!.key_1 + failed_metadata!.key_2 + failed_metadata!.key_3 + failed_metadata!.key_4;
                    let Failed_BookingInfo: BookingClass = Crypt.Decryption(failed_EncryptBookingInfo).data;

                    const Failed_Param = new TParam();
                    Failed_Param.Broker = Param.broker.guest.booking;
                    Failed_Param.function = Param.function.guest.booking.UpdateBookingInfo;

                    const paymentError = (await stripe.paymentIntents.retrieve(failedPaymentIntent.id)).last_payment_error;

                    Failed_BookingInfo.PaymentDetail.failPaymentID = failedPaymentIntent.id;
                    Failed_BookingInfo.PaymentDetail.PaymentStatus = PaymentStatus.fail;
                    Failed_BookingInfo.PaymentDetail.description = paymentError?.message || 'Fail to pay';
                    Failed_BookingInfo.bookingStatus = enumBookingStatus.cancelled;
                    Failed_BookingInfo.PaymentDetail.Session = Crypt.Encryption(failedPaymentIntent).data;
                    Failed_Param.data = Failed_BookingInfo;

                    const Failed_res = await BookingFunction.findFunction(Failed_Param, this.req!, this.res!, this.next!);

                    if (!Failed_res.isError) {
                        const user = await User.findOne({ _id: Failed_BookingInfo.userID });
                        const property = await Property.findOne({ _id: Failed_BookingInfo.propertyID });

                        if (property !== null && user !== null) {
                            const _Email = new Email({});

                            _Email.from = property.name;
                            _Email.to = user.email;
                            _Email.subject = 'Fail to Book' + ' ' + property.name;
                            _Email.html = EmailTemplate.FailedBooking({
                                propertyName: property.name,
                                failReason: Failed_res.Message,
                            });
                            await _Email.sendEmail(
                                () => { },
                                (err) => {
                                    this.objUserResponse = GetUserErrorObj(err, HttpStatusCodes.BAD_REQUEST);
                                }
                            );
                        }
                    }
                }
            } catch (err: any) {
                this.objUserResponse = GetUserErrorObj(err.message, HttpStatusCodes.BAD_REQUEST);
            }
        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_REQUEST);
        } finally {
            return this.objUserResponse;
        }
    };

    public UPIPayment = async (): Promise<UserResponse> => {
        try {
            const bookingInfo: BookingClass = this.objParam.data;

            const isVerified = await checkGuestVerification(bookingInfo.userID);

            if (isVerified.error === '') {

            } else {
                this.objUserResponse = GetUserErrorObj(isVerified.error, HttpStatusCodes.NOT_ACCEPTABLE);
            }
        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_REQUEST);
        } finally {
            return this.objUserResponse;
        }
    };
}

function splitIntoFourParts(str: string): string[] {
    const partLength = Math.ceil(str.length / 4);
    const part1 = str.substring(0, partLength);
    const part2 = str.substring(partLength, partLength * 2);
    const part3 = str.substring(partLength * 2, partLength * 3);
    const part4 = str.substring(partLength * 3);
    return [part1, part2, part3, part4];
}
