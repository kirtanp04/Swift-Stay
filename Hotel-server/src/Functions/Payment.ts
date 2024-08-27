import { NextFunction, Request, Response } from 'express';
import { Convert, GetUserErrorObj, GetUserSuccessObj, HttpStatusCodes, UserResponse } from '../common';
import { Param } from '../Constant';
import { checkGuestVerification } from '../middleware/GuestVerification';
import { TParam } from '../types/Type';
import { Booking, BookingClass } from '../models/BookingModel';
import Stripe from 'stripe';
import { SecrtKey } from '../env';
import { Property } from '../models/PropertyModel';

// guest
const _GuestCheckOut = Param.function.guest.payment.CheckOut;
const _GuestWebHook = Param.function.guest.payment.WebHook;

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
                                        unit_amount: Number(bookingInfo.totalPay?.split(' ')[1]) * 100,

                                    },
                                    quantity: 1

                                },
                            ],
                        });

                        const _Booking = await Booking.create(bookingInfo)
                        await _Booking.save()

                        this.objUserResponse = GetUserSuccessObj(Session.id, HttpStatusCodes.OK);
                    } catch (error: any) {
                        console.log(error)
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
                // Handle different Stripe events
                switch (event.type) {
                    case 'checkout.session.completed':
                        const session = event.data.object as Stripe.Checkout.Session;
                        console.log(session.payment_status)
                        // await PaymentFunction.handleSuccessfulCheckout(session);
                        break;
                    // Handle other webhook events if necessary
                    default:
                        console.log(`Unhandled event type ${event.type}`);
                }
            } catch (err: any) {
                console.error(`⚠️ Webhook signature verification failed.`, err.message);
                this.objUserResponse = GetUserErrorObj(err.message, HttpStatusCodes.BAD_REQUEST);
            }



        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_REQUEST);
        } finally {
            return this.objUserResponse
        }

    };

    // Function to handle successful checkout session
    // private static handleSuccessfulCheckout = async (session: Stripe.Checkout.Session): Promise<void> => {
    //     try {
    //         // Retrieve booking based on session ID
    //         const booking = await BookingClass.findOne({ stripeSessionId: session.id });

    //         if (!booking) {
    //             console.error(`Booking not found for session ID: ${session.id}`);
    //             return;
    //         }

    //         // Update the booking status to 'Completed' after payment success
    //         booking.status = 'Completed';
    //         await booking.save();

    //         console.log(`Payment completed for booking: ${booking._id}`);
    //     } catch (error: any) {
    //         console.error(`Error processing payment completion: ${error.message}`);
    //     }
    // };
}
