import { NextFunction, Request, Response } from 'express';
import PDFDocument from 'pdfkit';
import Stripe from 'stripe';
import { Cache, Crypt, GetUserErrorObj, GetUserSuccessObj, HttpStatusCodes, ProjectResponse, UserResponse } from '../common';
import { uuid } from '../common/uuid';
import { CacheKey, Param } from '../Constant';
import { checkGuestVerification } from '../middleware/GuestVerification';
import { Booking, BookingClass } from '../models/BookingModel';
import { Room } from '../models/RoomModel';
import { Invoice, TParam } from '../types/Type';

// guest
const _GuestSaveBookingInfo = Param.function.guest.booking.SaveBookingInfo;
const _GuestUpdateBookingInfo = Param.function.guest.booking.UpdateBookingInfo;
const _GuestGenerateInvoice = Param.function.guest.booking.generateInvoice;
const _GuestGetMyBookinglist = Param.function.guest.booking.getMyBookingList;

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

            case _GuestGenerateInvoice:
                this.objUserResponse = await _Function.GenerateInvoice();
                break;

            case _GuestGetMyBookinglist:
                this.objUserResponse = await _Function.GetUserBookingList();
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
                const BookingListCache = Cache.getCacheData(CacheKey.bookingList(objBooking.userID));

                if (BookingListCache.error === '') {
                    Cache.ClearCache(CacheKey.bookingList(objBooking.userID));
                }
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
                invoice,
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
                        invoice: invoice,
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

    public GenerateInvoice = async (): Promise<UserResponse> => {
        try {
            const { bookingID, userID } = this.objParam.data;


            const isVerified = await checkGuestVerification(userID);

            if (isVerified.error === '') {
                const BookingData = await Booking.findOne({
                    $and: [
                        {
                            _id: bookingID,
                        },
                        {
                            userID: userID,
                        },
                    ],
                });

                if (BookingData !== null) {
                    const RoomData = await Room.findOne({ _id: BookingData.roomID }).populate('property').exec();

                    const InvoiceData = new Invoice();
                    const Session: Stripe.Checkout.Session = Crypt.Decryption(BookingData.PaymentDetail.Session!).data;

                    InvoiceData.CreatedAt = new Date();
                    InvoiceData.CustomerInfo.Address = BookingData.UserInfo.address;
                    InvoiceData.CustomerInfo.City = BookingData.UserInfo.city;
                    InvoiceData.CustomerInfo.Country = BookingData.UserInfo.country;
                    InvoiceData.CustomerInfo.Email = BookingData.UserInfo.email;
                    InvoiceData.CustomerInfo.Name = BookingData.UserInfo.name;
                    InvoiceData.CustomerInfo.State = BookingData.UserInfo.state;
                    InvoiceData.CustomerInfo.Number = Number(BookingData.UserInfo.phone);

                    InvoiceData.InvoiceId = uuid();
                    InvoiceData.PaymentInfo.Currency = Session.currency!;
                    InvoiceData.PaymentInfo.PaymentID = Session.id;
                    InvoiceData.PaymentInfo.PaymentStatus = Session.payment_status as any;
                    InvoiceData.PaymentInfo.PaymentType = Session.payment_method_types[0];
                    InvoiceData.PaymentInfo.TotalPay = Session.amount_total! / 100;
                    InvoiceData.PaymentInfo.EmailID = Session.customer_details?.email!;
                    InvoiceData.PaymentInfo.HolderName = Session.customer_details?.name!;
                    InvoiceData.PaymentInfo.Country = Session.customer_details?.address?.country!;
                    InvoiceData.PaymentInfo.PaymentDate = new Date((Session.consent as any) * 1000).toString();

                    InvoiceData.BookingDetails.CheckIn = BookingData.stayInfo.checkIn!;
                    InvoiceData.BookingDetails.CheckOut = BookingData.stayInfo.checkOut!;
                    InvoiceData.BookingDetails.Adults = BookingData.stayInfo.adults!;
                    InvoiceData.BookingDetails.Childrens = BookingData.stayInfo.childrens!;
                    InvoiceData.BookingDetails.TotalStay = BookingData.stayInfo.totalStay!;

                    if (RoomData !== null) {
                        InvoiceData.PropertyInfo.PropertyAddress = RoomData.property.address;
                        InvoiceData.PropertyInfo.PropertyCity = RoomData.property.city;
                        InvoiceData.PropertyInfo.PropertyCountry = RoomData.property.country;
                        InvoiceData.PropertyInfo.PropertyName = RoomData.property.name;
                        InvoiceData.PropertyInfo.PropertyState = RoomData.property.state;
                        InvoiceData.PropertyInfo.PropertyType = RoomData.property.propertyType;

                        InvoiceData.RoomInfo.RoomPrice = RoomData.price;
                        InvoiceData.RoomInfo.RoomType = RoomData.type;
                    }

                    try {
                        const doc = new PDFDocument();

                        const res = new ProjectResponse();

                        const buffers: Buffer[] = [];

                        doc.fontSize(26).text('Invoice', { align: 'center' }).moveDown();
                        doc.fontSize(12).text(`Invoice ID: ${InvoiceData.InvoiceId}`).moveDown();
                        doc.text(`Date: ${InvoiceData.CreatedAt}`).moveDown();

                        doc.fontSize(18).text('Customer Details').moveDown();
                        doc.text(`Name: ${InvoiceData.CustomerInfo.Name}`).moveDown();
                        doc.text(`Email: ${InvoiceData.CustomerInfo.Email}`).moveDown();
                        doc.text(`Number: ${InvoiceData.CustomerInfo.Number}`).moveDown();
                        doc.text(`Address: ${InvoiceData.CustomerInfo.Address}`).moveDown();
                        doc.text(`City: ${InvoiceData.CustomerInfo.City}`).moveDown();
                        doc.text(`State: ${InvoiceData.CustomerInfo.State}`).moveDown();
                        doc.moveDown();

                        doc.fontSize(18).text('Payment Details').moveDown();
                        doc.text(`ID: ${InvoiceData.PaymentInfo.PaymentID}`).moveDown();
                        doc.text(`Status: ${InvoiceData.PaymentInfo.PaymentStatus}`).moveDown();
                        doc.text(`Type: ${InvoiceData.PaymentInfo.PaymentType}`).moveDown();
                        doc.text(`Paid Amount: ${InvoiceData.PaymentInfo.TotalPay}`).moveDown();
                        doc.text(`Currency: ${InvoiceData.PaymentInfo.Currency}`).moveDown();
                        doc.text(`Card Holder Name: ${InvoiceData.PaymentInfo.HolderName}`).moveDown();
                        doc.text(`Used Email ID: ${InvoiceData.PaymentInfo.EmailID}`).moveDown();
                        doc.text(`Country: ${InvoiceData.PaymentInfo.Country}`).moveDown();
                        doc.text(`Paid On: ${InvoiceData.PaymentInfo.PaymentDate}`).moveDown();
                        doc.moveDown();

                        doc.fontSize(18).text('Booking Details').moveDown();
                        doc.text(`Check-In: ${InvoiceData.BookingDetails.CheckIn}`).moveDown();
                        doc.text(`Check-Out: ${InvoiceData.BookingDetails.CheckOut}`).moveDown();
                        doc.text(`Adults: ${InvoiceData.BookingDetails.Adults}`).moveDown();
                        doc.text(`Childrens: ${InvoiceData.BookingDetails.Childrens}`).moveDown();
                        doc.text(`Total Nights: ${InvoiceData.BookingDetails.TotalStay}`).moveDown();
                        doc.text(`Total Pay: ${InvoiceData.BookingDetails.TotalPay}`).moveDown();
                        doc.moveDown();

                        doc.fontSize(18).text('Property Details').moveDown();
                        doc.text(`Name: $${InvoiceData.PropertyInfo.PropertyName}`).moveDown();
                        doc.text(`Type: ${InvoiceData.PropertyInfo.PropertyType}`).moveDown();
                        doc.text(`Address: ${InvoiceData.PropertyInfo.PropertyAddress}`).moveDown();
                        doc.text(`City: ${InvoiceData.PropertyInfo.PropertyCity}`).moveDown();
                        doc.text(`State: ${InvoiceData.PropertyInfo.PropertyState}`).moveDown();
                        doc.text(`Country: ${InvoiceData.PropertyInfo.PropertyCountry}`).moveDown();
                        doc.moveDown();

                        doc.fontSize(18).text('Room Details').moveDown();
                        doc.text(`Price: $${InvoiceData.RoomInfo.RoomPrice}`).moveDown();
                        doc.text(`Type: ${InvoiceData.RoomInfo.RoomType}`).moveDown();
                        doc.moveDown();

                        doc.text('Thank you for booking with us!', { align: 'center' });

                        doc.end();

                        const pdfData = await new Promise<Buffer>((resolve, reject) => {
                            doc.on('data', (chunk) => buffers.push(chunk));
                            doc.on('end', () => resolve(Buffer.concat(buffers)));
                            doc.on('error', (err) => reject(err));
                        });

                        const isUpdated = await Booking.findOneAndUpdate(
                            { $and: [{ _id: bookingID }, { userID: userID }] },
                            { $set: { invoice: pdfData } },
                            { new: true }
                        );

                        if (isUpdated !== null) {
                            this.objUserResponse = GetUserSuccessObj(isUpdated, HttpStatusCodes.OK);
                        } else {
                            this.objUserResponse = GetUserErrorObj(
                                'Booking not found or Invoice update failed',
                                HttpStatusCodes.INTERNAL_SERVER_ERROR
                            );
                        }
                    } catch (error: any) {
                        this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.INTERNAL_SERVER_ERROR);
                    }
                } else {
                    this.objUserResponse = GetUserErrorObj(
                        'No such booking info available to generate invoice',
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

    public GetUserBookingList = async (): Promise<UserResponse> => {
        try {
            const userID = this.objParam.data;

            const isUser = await checkGuestVerification(userID);

            if (isUser.error === '') {
                const BookingListCache = Cache.getCacheData(CacheKey.bookingList(userID));

                if (BookingListCache.error === '') {
                    this.objUserResponse = GetUserSuccessObj(BookingListCache.data, HttpStatusCodes.OK);
                } else {
                    const BookingList = await Booking.aggregate([
                        {
                            $match: {
                                userID: userID,
                            },
                        },
                        {
                            $addFields: {
                                propertyID: { $toObjectId: '$propertyID' },
                                roomID: { $toObjectId: '$roomID' },
                            },
                        },
                        {
                            $lookup: {
                                from: 'properties',
                                localField: 'propertyID',
                                foreignField: '_id',
                                as: 'property',
                            },
                        },
                        {
                            $lookup: {
                                from: 'rooms',
                                localField: 'roomID',
                                foreignField: '_id',
                                as: 'room',
                            },
                        },
                        {
                            $unwind: {
                                path: '$room',
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $unwind: {
                                path: '$property',
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                    ]);

                    Cache.SetCache(CacheKey.bookingList(userID), BookingList);
                    this.objUserResponse = GetUserSuccessObj(BookingList, HttpStatusCodes.OK);
                }
            } else {
                this.objUserResponse = GetUserErrorObj(isUser.error, HttpStatusCodes.NOT_ACCEPTABLE);
            }
        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_REQUEST);
        } finally {
            return this.objUserResponse;
        }
    };
}
