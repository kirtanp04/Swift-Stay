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

                const encryptedMetaData: any[] = splitIntoThreeParts(Crypt.Encryption(bookingInfo).data);

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
                                    quantity: 1,
                                },
                            ],
                            metadata: {
                                key_1: encryptedMetaData[0],
                                key_2: encryptedMetaData[1],
                                key_3: encryptedMetaData[2],
                            },
                        });
                        const _Param = new TParam();
                        _Param.Broker = Param.broker.guest.booking;
                        _Param.function = Param.function.guest.booking.SaveBookingInfo;

                        bookingInfo.PaymentDetail.PaymentStatus = PaymentStatus.pending;
                        bookingInfo.totalPay = (Session.currency! + Session.amount_total! / 100) as any;
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
                        const _EncryptBookingInfo = _metadata!.key_1 + _metadata!.key_2 + _metadata!.key_3;
                        let _bookingInfo: BookingClass = Crypt.Decryption(_EncryptBookingInfo).data;

                        const _Param = new TParam();
                        _Param.Broker = Param.broker.guest.booking;
                        _Param.function = Param.function.guest.booking.UpdateBookingInfo;
                        _bookingInfo.PaymentDetail.PaymentID = paymentIntent.id;
                        _bookingInfo.PaymentDetail.PaymentStatus = PaymentStatus.paid;
                        _bookingInfo.PaymentDetail.description = 'Payment was successfully done';
                        _bookingInfo.PaymentDetail.Session = Crypt.Encryption(paymentIntent).data
                        _bookingInfo.bookingStatus = enumBookingStatus.booked;

                        _Param.data = _bookingInfo;
                        const _res = await BookingFunction.findFunction(_Param, this.req!, this.res!, this.next!);

                        if (!_res.isError) {
                            const user = await User.findOne({ _id: _bookingInfo.userID });
                            const room = await Room.findOne({ _id: _bookingInfo.roomID }).populate('property').exec();

                            if (room && user) {
                                const _Email = new Email({
                                    next: this.next!,
                                });

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
                    } catch (error) {
                        console.log(error);
                    }
                }

                if (event.type === 'checkout.session.async_payment_failed') {
                    const failedPaymentIntent = event.data.object as Stripe.Checkout.Session;
                    console.log('fail');
                    const failed_metadata = failedPaymentIntent.metadata;
                    const failed_EncryptBookingInfo = failed_metadata!.key_1 + failed_metadata!.key_2 + failed_metadata!.key_3;
                    let Failed_BookingInfo: BookingClass = Crypt.Decryption(failed_EncryptBookingInfo).data;

                    const Failed_Param = new TParam();
                    Failed_Param.Broker = Param.broker.guest.booking;
                    Failed_Param.function = Param.function.guest.booking.UpdateBookingInfo;

                    Failed_BookingInfo.PaymentDetail.failPaymentID = failedPaymentIntent.id;
                    Failed_BookingInfo.PaymentDetail.PaymentStatus = PaymentStatus.fail;
                    Failed_BookingInfo.PaymentDetail.description = 'Fail to pay';
                    Failed_BookingInfo.bookingStatus = enumBookingStatus.cancelled;

                    Failed_Param.data = Failed_BookingInfo;

                    const Failed_res = await BookingFunction.findFunction(Failed_Param, this.req!, this.res!, this.next!);
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
}

function splitIntoThreeParts(str: string): string[] {
    const partLength = Math.ceil(str.length / 3);
    const part1 = str.substring(0, partLength);
    const part2 = str.substring(partLength, partLength * 2);
    const part3 = str.substring(partLength * 2);
    return [part1, part2, part3];
}

const CreateInvoice = async (
    objBooking: BookingClass,
    Session: Stripe.Checkout.Session,
    objRoom: RoomClass
): Promise<ProjectResponse> => {
    const res = new ProjectResponse();
    console.log('call');

    const _res: ProjectResponse = await new Promise((resolve, reject) => {
        setTimeout(() => resolve(res), 1000);
    });
    // try {
    //     // const InvoiceData = new Invoice();

    //     // InvoiceData.CreatedAt = new Date();
    //     // InvoiceData.CustomerInfo.Address = objBooking.UserInfo.address;
    //     // InvoiceData.CustomerInfo.City = objBooking.UserInfo.city;
    //     // InvoiceData.CustomerInfo.Country = objBooking.UserInfo.country;
    //     // InvoiceData.CustomerInfo.Email = objBooking.UserInfo.email;
    //     // InvoiceData.CustomerInfo.Name = objBooking.UserInfo.name;
    //     // InvoiceData.CustomerInfo.State = objBooking.UserInfo.state;
    //     // InvoiceData.CustomerInfo.Number = Number(objBooking.UserInfo.phone);

    //     // InvoiceData.InvoiceId = uuid();
    //     // InvoiceData.PaymentInfo.Currency = Session.currency!;
    //     // InvoiceData.PaymentInfo.PaymentID = Session.id;
    //     // InvoiceData.PaymentInfo.PaymentStatus = Session.payment_status as any;
    //     // InvoiceData.PaymentInfo.PaymentType = Session.payment_method_types[0];
    //     // InvoiceData.PaymentInfo.TotalPay = Session.amount_total! / 100;
    //     // InvoiceData.PaymentInfo.EmailID = Session.customer_details?.email!;
    //     // InvoiceData.PaymentInfo.HolderName = Session.customer_details?.name!;
    //     // InvoiceData.PaymentInfo.Country = Session.customer_details?.address?.country!;
    //     // InvoiceData.PaymentInfo.PaymentDate = new Date((Session.consent as any) * 1000).toString();

    //     // InvoiceData.BookingDetails.CheckIn = objBooking.stayInfo.checkIn!;
    //     // InvoiceData.BookingDetails.CheckOut = objBooking.stayInfo.checkOut!;
    //     // InvoiceData.BookingDetails.Adults = objBooking.stayInfo.adults!;
    //     // InvoiceData.BookingDetails.Childrens = objBooking.stayInfo.childrens!;
    //     // InvoiceData.BookingDetails.TotalStay = objBooking.stayInfo.totalStay!;

    //     // InvoiceData.PropertyInfo.PropertyAddress = objRoom.property.address;
    //     // InvoiceData.PropertyInfo.PropertyCity = objRoom.property.city;
    //     // InvoiceData.PropertyInfo.PropertyCountry = objRoom.property.country;
    //     // InvoiceData.PropertyInfo.PropertyName = objRoom.property.name;
    //     // InvoiceData.PropertyInfo.PropertyState = objRoom.property.state;
    //     // InvoiceData.PropertyInfo.PropertyType = objRoom.property.propertyType;

    //     // InvoiceData.RoomInfo.RoomPrice = objRoom.price;
    //     // InvoiceData.RoomInfo.RoomType = objRoom.type;

    //     // const doc = new PDFDocument();

    //     // const fileName = `invoice-${objRoom.property.name}.pdf`;
    //     // const filePath = path.join(__dirname, 'public', fileName);
    //     // const writeStream = fs.createWriteStream(filePath);
    //     // doc.pipe(writeStream);

    //     // doc.fontSize(26).text('Invoice', { align: 'center' }).moveDown();
    //     // doc.fontSize(12).text(`Invoice ID: ${InvoiceData.InvoiceId}`).moveDown();
    //     // doc.text(`Date: ${InvoiceData.CreatedAt}`).moveDown();

    //     // doc.fontSize(18).text('Customer Details').moveDown();
    //     // doc.text(`Name: ${InvoiceData.CustomerInfo.Name}`).moveDown();
    //     // doc.text(`Email: ${InvoiceData.CustomerInfo.Email}`).moveDown();
    //     // doc.text(`Number: ${InvoiceData.CustomerInfo.Number}`).moveDown();
    //     // doc.text(`Address: ${InvoiceData.CustomerInfo.Address}`).moveDown();
    //     // doc.text(`City: ${InvoiceData.CustomerInfo.City}`).moveDown();
    //     // doc.text(`State: ${InvoiceData.CustomerInfo.State}`).moveDown();
    //     // doc.moveDown();

    //     // doc.fontSize(18).text('Payment Details').moveDown();
    //     // doc.text(`ID: ${InvoiceData.PaymentInfo.PaymentID}`).moveDown();
    //     // doc.text(`Status: ${InvoiceData.PaymentInfo.PaymentStatus}`).moveDown();
    //     // doc.text(`Type: ${InvoiceData.PaymentInfo.PaymentType}`).moveDown();
    //     // doc.text(`Paid Amount: ${InvoiceData.PaymentInfo.TotalPay}`).moveDown();
    //     // doc.text(`Currency: ${InvoiceData.PaymentInfo.Currency}`).moveDown();
    //     // doc.text(`Card Holder Name: ${InvoiceData.PaymentInfo.HolderName}`).moveDown();
    //     // doc.text(`Used Email ID: ${InvoiceData.PaymentInfo.EmailID}`).moveDown();
    //     // doc.text(`Country: ${InvoiceData.PaymentInfo.Country}`).moveDown();
    //     // doc.text(`Paid On: ${InvoiceData.PaymentInfo.PaymentDate}`).moveDown();
    //     // doc.moveDown();

    //     // doc.fontSize(18).text('Booking Details').moveDown();
    //     // doc.text(`Check-In: ${InvoiceData.BookingDetails.CheckIn}`).moveDown();
    //     // doc.text(`Check-Out: ${InvoiceData.BookingDetails.CheckOut}`).moveDown();
    //     // doc.text(`Adults: ${InvoiceData.BookingDetails.Adults}`).moveDown();
    //     // doc.text(`Childrens: ${InvoiceData.BookingDetails.Childrens}`).moveDown();
    //     // doc.text(`Total Nights: ${InvoiceData.BookingDetails.TotalStay}`).moveDown();
    //     // doc.text(`Total Pay: ${InvoiceData.BookingDetails.TotalPay}`).moveDown();
    //     // doc.moveDown();

    //     // doc.fontSize(18).text('Property Details').moveDown();
    //     // doc.text(`Name: $${InvoiceData.PropertyInfo.PropertyName}`).moveDown();
    //     // doc.text(`Type: ${InvoiceData.PropertyInfo.PropertyType}`).moveDown();
    //     // doc.text(`Address: ${InvoiceData.PropertyInfo.PropertyAddress}`).moveDown();
    //     // doc.text(`City: ${InvoiceData.PropertyInfo.PropertyCity}`).moveDown();
    //     // doc.text(`State: ${InvoiceData.PropertyInfo.PropertyState}`).moveDown();
    //     // doc.text(`Country: ${InvoiceData.PropertyInfo.PropertyCountry}`).moveDown();
    //     // doc.moveDown();

    //     // doc.fontSize(18).text('Room Details').moveDown();
    //     // doc.text(`Price: $${InvoiceData.RoomInfo.RoomPrice}`).moveDown();
    //     // doc.text(`Type: ${InvoiceData.RoomInfo.RoomType}`).moveDown();
    //     // doc.moveDown();

    //     // doc.text('Thank you for booking with us!', { align: 'center' });

    //     // doc.end();

    //     // writeStream.on('finish', () => {
    //     //     // Create a downloadable URL
    //     //     const fileUrl = `${this.req?.protocol}://${this.req?.get('host')}/files/${fileName}`;
    //     //     res.data = fileUrl
    //     // });

    //     // // Handle any error that might occur during PDF generation
    //     // writeStream.on('error', (err) => {
    //     //     console.error('Error writing the PDF file:', err);
    //     //     res.error = 'Error generating the PDF' + err;
    //     // });

    // } catch (error: any) {
    //     res.error = error.message
    // } finally {
    return _res;
    // }
};

// import express, { Request, Response } from 'express';
// import PDFDocument from 'pdfkit';
// import fs from 'fs';
// import path from 'path';

// const app = express();

// app.use(express.json());

// // Serving static files from a 'public' directory
// app.use('/files', express.static(path.join(__dirname, 'public')));

// interface InvoiceData {
//   invoiceNumber: string;
//   bookingDate: string;
//   customerName: string;
//   email: string;
//   propertyName: string;
//   roomType: string;
//   checkIn: string;
//   checkOut: string;
//   totalAmount: number;
//   paymentStatus: string;
// }

// app.post('/generate-invoice', (req: Request, res: Response) => {
//   const invoiceData: InvoiceData = req.body;

//   // Create a new PDF document
//   const doc = new PDFDocument();

//   // Set the file path where the PDF will be saved
//   const fileName = `invoice-${invoiceData.invoiceNumber}.pdf`;
//   const filePath = path.join(__dirname, 'public', fileName);

//   // Write the PDF to a file
//   const writeStream = fs.createWriteStream(filePath);
//   doc.pipe(writeStream);

//   // Add content to the PDF
//   doc.fontSize(26).text('Invoice', { align: 'center' }).moveDown();
//   doc.fontSize(12).text(`Invoice Number: ${invoiceData.invoiceNumber}`);
//   doc.text(`Booking Date: ${invoiceData.bookingDate}`);
//   doc.text(`Customer Name: ${invoiceData.customerName}`);
//   doc.text(`Email: ${invoiceData.email}`);
//   doc.moveDown();
//   doc.fontSize(18).text('Booking Details').moveDown();
//   doc.fontSize(12).text(`Property: ${invoiceData.propertyName}`);
//   doc.text(`Room Type: ${invoiceData.roomType}`);
//   doc.text(`Check-In: ${invoiceData.checkIn}`);
//   doc.text(`Check-Out: ${invoiceData.checkOut}`).moveDown();
//   doc.fontSize(18).text('Payment Details').moveDown();
//   doc.fontSize(12).text(`Total Amount: $${invoiceData.totalAmount.toFixed(2)}`);
//   doc.text(`Payment Status: ${invoiceData.paymentStatus}`).moveDown();
//   doc.text('Thank you for booking with us!', { align: 'center' });

//   // Finalize the PDF and close the stream
//   doc.end();

//   // Send response when the PDF is finished writing
//   writeStream.on('finish', () => {
//     // Create a downloadable URL
//     const fileUrl = `${req.protocol}://${req.get('host')}/files/${fileName}`;
//     res.json({ fileUrl });
//   });

//   // Handle any error that might occur during PDF generation
//   writeStream.on('error', (err) => {
//     console.error('Error writing the PDF file:', err);
//     res.status(500).json({ message: 'Error generating the PDF' });
//   });
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
