import { NextFunction, Request, Response } from 'express';
import PDFDocument from 'pdfkit';
import Stripe from 'stripe';
import { Cache, Crypt, GetUserErrorObj, GetUserSuccessObj, HttpStatusCodes, ProjectResponse, UserResponse } from '../common';
import { uuid } from '../common/uuid';
import { CacheKey, Param } from '../Constant';
import { checkGuestVerification } from '../middleware/GuestVerification';
import { Booking, BookingClass, enumBookingStatus } from '../models/BookingModel';
import { Room } from '../models/RoomModel';
import CronScheduler from '../service/Cron';
import { Invoice, TParam } from '../types/Type';
import moment from 'moment';
import { checkAdminVerification } from '../middleware/AdiminVerification';

// guest
const _GuestSaveBookingInfo = Param.function.guest.booking.SaveBookingInfo;
const _GuestUpdateBookingInfo = Param.function.guest.booking.UpdateBookingInfo;
const _GuestGenerateInvoice = Param.function.guest.booking.generateInvoice;
const _GuestGetMyBookinglist = Param.function.guest.booking.getMyBookingList;

//Admin
const _GetAllBookingListByAdmin = Param.function.manager.booking.GetBookingListByAdmin
const _GetAllBookedUser = Param.function.manager.booking.GetAllBookedUser

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

            case _GetAllBookingListByAdmin:
                this.objUserResponse = await _Function.GetManagerBookingList();
                break;

            case _GetAllBookedUser:
                this.objUserResponse = await _Function.GetAllBookedUser();
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

    private Scheduler = new CronScheduler();

    private JobName: string = 'BookingScheduler';

    private StartBookingSchedular = async (): Promise<void> => {
        try {
            const allBookings = await Booking.aggregate([
                {
                    $match: {
                        bookingStatus: enumBookingStatus.booked,
                    },
                },
                {
                    $addFields: {
                        email: '$UserInfo.email',
                        date: '$stayInfo.checkIn',
                    },
                },
                {
                    $project: {
                        _id: 0,
                        email: 1,
                        date: 1,
                    },
                },
            ]);

            const currentDate = moment();
            const Emails: string[] = []
            allBookings.forEach((objBook) => {
                const dateDiff = moment(objBook.date, 'DD/MM/YYYY');

                const duration = moment.duration(dateDiff.diff(currentDate));

                if (duration.asDays() === 2) {
                    Emails.push(objBook.email)
                }

            })


            //  loop to emails add to que and send email
        } catch (error) { }
    };

    public SaveBooking = async (): Promise<UserResponse> => {
        try {
            const objBooking: BookingClass = this.objParam.data;

            const _Booking = await Booking.create({
                BookingDate: objBooking.BookingDate,
                bookingStatus: objBooking.bookingStatus,
                CancleDate: objBooking.CancleDate,
                invoice: objBooking.invoice,
                OptionalInfo: objBooking.OptionalInfo,
                PaymentDetail: objBooking.PaymentDetail,
                propertyID: objBooking.propertyID,
                ReasonForCancle: objBooking.ReasonForCancle,
                roomID: objBooking.roomID,
                stayInfo: objBooking.stayInfo,
                totalPay: objBooking.totalPay,
                userID: objBooking.userID,
                UserInfo: objBooking.UserInfo,
                YourArrivalTime: objBooking.YourArrivalTime,
                currency: objBooking.currency,
                adminID: objBooking.adminID
            });
            await _Booking.save();

            if (_Booking) {
                const BookingListCache = Cache.getCacheData(CacheKey.user.bookingList(objBooking.userID));

                const GetCacheData = Cache.getCacheData(CacheKey.manager.Analytics.BookingBase(objBooking.adminID));

                const ManagerBookingListCache = Cache.getCacheData(CacheKey.manager.bookingList(objBooking.adminID));

                if (ManagerBookingListCache.error === '') {
                    Cache.ClearCache(CacheKey.manager.bookingList(objBooking.adminID));
                }

                if (GetCacheData.error === '') {
                    Cache.ClearCache(CacheKey.manager.Analytics.BookingBase(objBooking.adminID));
                }

                if (BookingListCache.error === '') {
                    Cache.ClearCache(CacheKey.user.bookingList(objBooking.userID));
                }

                const res = this.Scheduler.listJobs();


                if (!res.message.includes(this.JobName)) {
                    this.Scheduler.addCronJob(
                        this.JobName,
                        this.Scheduler.CronTime().every5Seconds,
                        () => this.StartBookingSchedular(),
                        true
                    );
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
                adminID,
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
                if (bookingStatus === enumBookingStatus.booked) {
                    await Room.findOneAndUpdate(
                        {
                            $and: [
                                {
                                    _id: roomID,
                                },
                                {
                                    adminID: adminID,
                                },
                            ],
                        },
                        {
                            $set: {
                                isAvailable: false,
                            },
                        }
                    );
                }

                Cache.ClearAllCache();
                if (bookingStatus === enumBookingStatus.booked) {
                    this.objUserResponse = GetUserSuccessObj('Success: booking info Updated', HttpStatusCodes.OK);
                } else if (bookingStatus === enumBookingStatus.cancelled) {
                    this.objUserResponse = GetUserErrorObj('Your booking was cancled' + PaymentDetail.description, HttpStatusCodes.OK);
                }
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
                    if (BookingData?.invoice === null) {
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
                        InvoiceData.BookingDetails.TotalPay = `${BookingData.totalPay!}`;
                        InvoiceData.BookingDetails.currency = BookingData.currency;

                        if (RoomData !== null) {
                            InvoiceData.PropertyInfo.PropertyAddress = RoomData.property.address;
                            InvoiceData.PropertyInfo.PropertyCity = RoomData.property.city;
                            InvoiceData.PropertyInfo.PropertyCountry = RoomData.property.country;
                            InvoiceData.PropertyInfo.PropertyName = RoomData.property.name;
                            InvoiceData.PropertyInfo.PropertyState = RoomData.property.state;
                            InvoiceData.PropertyInfo.PropertyType = RoomData.property.propertyType;

                            InvoiceData.RoomInfo.RoomPrice = RoomData.price;
                            InvoiceData.RoomInfo.currency = RoomData.currency;
                            InvoiceData.RoomInfo.RoomType = RoomData.type;
                        }

                        try {
                            const doc = new PDFDocument({ size: 'A4', margin: 50 });
                            const res = new ProjectResponse();
                            const buffers: Buffer[] = [];
                            const primaryColor = '#004d99';
                            const headerColor = '#ff9900';
                            const lineHeight = 15;
                            let yPosLeft = 100;
                            let yPosRight = 100;
                            const leftColumnX = 50;
                            const rightColumnX = 300;

                            // Title

                            doc.fontSize(24).fillColor(primaryColor).text('Swift Stay | Booking Invoice', { align: 'center' }).moveDown(2);

                            // Customer Details
                            doc
                                .rect(leftColumnX, yPosLeft, 200, 20)
                                .fillAndStroke(headerColor, 'black')
                                .fillColor('white')
                                .fontSize(14)
                                .text('Customer Details', leftColumnX + 10, yPosLeft + 5)
                                .fillColor('black');

                            yPosLeft += 40;

                            doc
                                .fontSize(12)
                                .fillColor('gray')
                                .text(`Name: ${InvoiceData.CustomerInfo.Name}`, leftColumnX, yPosLeft)
                                .text(`Email: ${InvoiceData.CustomerInfo.Email}`, leftColumnX, yPosLeft + lineHeight)
                                .text(`Address: ${InvoiceData.CustomerInfo.Address}`, leftColumnX, yPosLeft + lineHeight * 2)
                                .text(`City: ${InvoiceData.CustomerInfo.City}`, leftColumnX, yPosLeft + lineHeight * 3)
                                .text(`Country: ${InvoiceData.CustomerInfo.Country}`, leftColumnX, yPosLeft + lineHeight * 4)
                                .text(`Phone Number: ${InvoiceData.CustomerInfo.Number}`, leftColumnX, yPosLeft + lineHeight * 5);

                            yPosLeft += lineHeight * 6;

                            // Payment Details
                            doc
                                .rect(rightColumnX, yPosRight, 200, 20)
                                .fillAndStroke(headerColor, 'black')
                                .fillColor('white')
                                .fontSize(14)
                                .text('Payment Details', rightColumnX + 10, yPosRight + 5)
                                .fillColor('black');

                            yPosRight += 40;

                            doc
                                .fontSize(12)
                                .fillColor('gray')
                                .text(`Payment ID: ${InvoiceData.PaymentInfo.PaymentID}`, rightColumnX, yPosRight)
                                .text(`Payment Method: ${InvoiceData.PaymentInfo.PaymentType}`, rightColumnX, yPosRight + lineHeight * 3)
                                .text(`Payment Status: ${InvoiceData.PaymentInfo.PaymentStatus}`, rightColumnX, yPosRight + lineHeight * 4)
                                .text(`Total Paid: ${InvoiceData.PaymentInfo.TotalPay}`, rightColumnX, yPosRight + lineHeight * 5)
                                .text(`Currency: ${InvoiceData.PaymentInfo.Currency}`, rightColumnX, yPosRight + lineHeight * 6)
                                .text(
                                    `Payment Date: ${new Date(InvoiceData.PaymentInfo.PaymentDate).toLocaleDateString()}`,
                                    rightColumnX,
                                    yPosRight + lineHeight * 7
                                )
                                .text(`Card Holder Name: ${InvoiceData.PaymentInfo.HolderName}`, rightColumnX, yPosRight + lineHeight * 8)
                                .text(`Email: ${InvoiceData.PaymentInfo.EmailID}`, rightColumnX, yPosRight + lineHeight * 9)
                                .text(`Country: ${InvoiceData.PaymentInfo.Country}`, rightColumnX, yPosRight + lineHeight * 10);

                            yPosRight += lineHeight * 9;

                            let yPos = Math.max(yPosLeft, yPosRight) + 50;

                            // Booking Details
                            doc
                                .rect(leftColumnX, yPos, 450, 20)
                                .fillAndStroke(headerColor, 'black')
                                .fillColor('white')
                                .fontSize(14)
                                .text('Booking Details', leftColumnX + 10, yPos + 5)
                                .fillColor('black');

                            yPos += 30;

                            doc
                                .fontSize(12)
                                .fillColor('gray')
                                .text(`Check-In: ${InvoiceData.BookingDetails.CheckIn}`, leftColumnX, yPos)
                                .text(`Check-Out: ${InvoiceData.BookingDetails.CheckOut}`, leftColumnX, yPos + lineHeight)
                                .text(`Adults: ${InvoiceData.BookingDetails.Adults}`, leftColumnX, yPos + lineHeight * 2)
                                .text(`Children: ${InvoiceData.BookingDetails.Childrens}`, leftColumnX, yPos + lineHeight * 3)
                                .text(`Total Stay: ${InvoiceData.BookingDetails.TotalStay}`, leftColumnX, yPos + lineHeight * 4)
                                .text(`Total Pay: ${InvoiceData.BookingDetails.TotalPay}`, leftColumnX, yPos + lineHeight * 5);
                            // .text(`Pay Currency: ${InvoiceData.BookingDetails.currency}`, leftColumnX, yPos + lineHeight * 6);

                            yPos += lineHeight * 6;

                            // Property Details
                            doc
                                .rect(leftColumnX, yPos, 450, 20)
                                .fillAndStroke(headerColor, 'black')
                                .fillColor('white')
                                .fontSize(14)
                                .text('Property Details', leftColumnX + 10, yPos + 5)
                                .fillColor('black');

                            yPos += 30;

                            doc
                                .fontSize(12)
                                .fillColor('gray')
                                .text(`Property Name: ${InvoiceData.PropertyInfo.PropertyName}`, leftColumnX, yPos)
                                .text(`Property Type: ${InvoiceData.PropertyInfo.PropertyType}`, leftColumnX, yPos + lineHeight)
                                .text(`Address: ${InvoiceData.PropertyInfo.PropertyAddress}`, leftColumnX, yPos + lineHeight * 2)
                                .text(`City: ${InvoiceData.PropertyInfo.PropertyCity}`, leftColumnX, yPos + lineHeight * 3)
                                .text(`State: ${InvoiceData.PropertyInfo.PropertyState}`, leftColumnX, yPos + lineHeight * 4)
                                .text(`Country: ${InvoiceData.PropertyInfo.PropertyCountry}`, leftColumnX, yPos + lineHeight * 5);

                            yPos += lineHeight * 6;

                            // Room Details
                            doc
                                .rect(leftColumnX, yPos, 450, 20)
                                .fillAndStroke(headerColor, 'black')
                                .fillColor('white')
                                .fontSize(14)
                                .text('Room Details', leftColumnX + 10, yPos + 5)
                                .fillColor('black');

                            yPos += 30;

                            doc
                                .fontSize(12)
                                .fillColor('gray')
                                .text(`Room Type: ${InvoiceData.RoomInfo.RoomType}`, leftColumnX, yPos)
                                .text(`Room Price: ${InvoiceData.RoomInfo.RoomPrice}`, leftColumnX, yPos + lineHeight);
                            // .text(`Room Price Currency: ${InvoiceData.RoomInfo.currency}`, leftColumnX, yPos + lineHeight + lineHeight);

                            // Footer
                            yPos += 50;
                            doc.moveTo(50, yPos).lineTo(550, yPos).stroke();

                            doc
                                .fontSize(10)
                                .fillColor('black')
                                .text(`Invoice ID: ${InvoiceData.InvoiceId}`, leftColumnX, yPos + 10)
                                .text(`Invoice Date: ${InvoiceData.CreatedAt.toLocaleDateString()}`, leftColumnX, yPos + 25);

                            doc.end();

                            const pdfData = await new Promise<Buffer[]>((resolve, reject) => {
                                doc.on('data', (chunk) => buffers.push(chunk));
                                doc.on('end', () => resolve(buffers));
                                doc.on('error', (err) => reject(err));
                            });

                            const pdfBase64 = Buffer.concat(pdfData).toString('base64');

                            const isUpdated = await Booking.findOneAndUpdate(
                                { $and: [{ _id: bookingID }, { userID: userID }] },
                                { $set: { invoice: 'data:application/pdf;base64,' + pdfBase64 } },
                                { new: true }
                            );

                            if (isUpdated !== null) {
                                const bookingCache = Cache.getCacheData(CacheKey.user.bookingList(userID));
                                if (bookingCache.error === '') {
                                    Cache.ClearCache(CacheKey.user.bookingList(userID));
                                }
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
                        this.objUserResponse = GetUserErrorObj('Your Invoice is already been generated', HttpStatusCodes.NOT_ACCEPTABLE);
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
                const BookingListCache = Cache.getCacheData(CacheKey.user.bookingList(userID));

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

                    Cache.SetCache(CacheKey.user.bookingList(userID), BookingList);
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

    public GetManagerBookingList = async (): Promise<UserResponse> => {
        try {
            const adminID = this.objParam.data;

            const isAdmin = await checkAdminVerification(adminID);

            if (isAdmin.error === '') {
                const BookingListCache = Cache.getCacheData(CacheKey.manager.bookingList(adminID));

                if (BookingListCache.error === '') {
                    this.objUserResponse = GetUserSuccessObj(BookingListCache.data, HttpStatusCodes.OK);
                } else {
                    const BookingList = await Booking.aggregate([
                        {
                            $match: {
                                adminID: adminID,
                            },

                        },
                        {
                            $addFields: {
                                propertyID: { $toObjectId: "$propertyID" },
                                roomID: { $toObjectId: "$roomID" },
                            },
                        },
                        {
                            $lookup: {
                                from: "properties",
                                localField: "propertyID",
                                foreignField: "_id",
                                as: "property",
                            },
                        },

                        {
                            $lookup: {
                                from: "rooms",
                                localField: "roomID",
                                foreignField: "_id",
                                as: "room",
                            },
                        },
                        {
                            $unwind: {
                                path: "$property",
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $unwind: {
                                path: "$room",
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                    ]);

                    Cache.SetCache(CacheKey.manager.bookingList(adminID), BookingList);
                    this.objUserResponse = GetUserSuccessObj(BookingList, HttpStatusCodes.OK);
                }
            } else {
                this.objUserResponse = GetUserErrorObj(isAdmin.error, HttpStatusCodes.NOT_ACCEPTABLE);
            }
        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_REQUEST);
        } finally {
            return this.objUserResponse;
        }
    };

    public GetAllBookedUser = async (): Promise<UserResponse> => {
        try {
            const adminID = this.objParam.data;

            const isAdmin = await checkAdminVerification(adminID);

            if (isAdmin.error === '') {
                const BookingListCache = Cache.getCacheData(CacheKey.manager.bookingList(adminID));

                if (BookingListCache.error === '') {
                    this.objUserResponse = GetUserSuccessObj(BookingListCache.data, HttpStatusCodes.OK);
                } else {
                    const BookingList = await Booking.aggregate([
                        {
                            $match: {
                                adminID: adminID,
                            },

                        },
                        {
                            $addFields: {
                                propertyID: { $toObjectId: "$propertyID" },
                                roomID: { $toObjectId: "$roomID" },
                            },
                        },
                        {
                            $lookup: {
                                from: "properties",
                                localField: "propertyID",
                                foreignField: "_id",
                                as: "property",
                            },
                        },

                        {
                            $lookup: {
                                from: "rooms",
                                localField: "roomID",
                                foreignField: "_id",
                                as: "room",
                            },
                        },
                        {
                            $unwind: {
                                path: "$property",
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $unwind: {
                                path: "$room",
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                    ]);

                    Cache.SetCache(CacheKey.manager.bookingList(adminID), BookingList);
                    this.objUserResponse = GetUserSuccessObj(BookingList, HttpStatusCodes.OK);
                }
            } else {
                this.objUserResponse = GetUserErrorObj(isAdmin.error, HttpStatusCodes.NOT_ACCEPTABLE);
            }
        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_REQUEST);
        } finally {
            return this.objUserResponse;
        }
    };
}
