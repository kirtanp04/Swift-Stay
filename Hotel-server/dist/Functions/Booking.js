"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingFunction = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const common_1 = require("../common");
const uuid_1 = require("../common/uuid");
const Constant_1 = require("../Constant");
const GuestVerification_1 = require("../middleware/GuestVerification");
const BookingModel_1 = require("../models/BookingModel");
const RoomModel_1 = require("../models/RoomModel");
const Cron_1 = __importDefault(require("../service/Cron"));
const Type_1 = require("../types/Type");
const moment_1 = __importDefault(require("moment"));
const AdiminVerification_1 = require("../middleware/AdiminVerification");
const mongoose_1 = __importDefault(require("mongoose"));
// guest
const _GuestSaveBookingInfo = Constant_1.Param.function.guest.booking.SaveBookingInfo;
const _GuestUpdateBookingInfo = Constant_1.Param.function.guest.booking.UpdateBookingInfo;
const _GuestGenerateInvoice = Constant_1.Param.function.guest.booking.generateInvoice;
const _GuestGetMyBookinglist = Constant_1.Param.function.guest.booking.getMyBookingList;
//Admin
const _GetAllBookingListByAdmin = Constant_1.Param.function.manager.booking.GetBookingListByAdmin;
const _GetAllChatBookedUser = Constant_1.Param.function.manager.booking.GetAllChatBookedUser;
const _GetUserBookingDetail = Constant_1.Param.function.manager.booking.GetUserBookingDetail;
class BookingFunction {
}
exports.BookingFunction = BookingFunction;
_a = BookingFunction;
BookingFunction.objUserResponse = new common_1.UserResponse();
BookingFunction.findFunction = (objParam, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let _Function = new Functions();
    _Function.req = req;
    _Function.res = res;
    _Function.next = next;
    _Function.objParam = objParam;
    switch (objParam.function) {
        case _GuestSaveBookingInfo:
            _a.objUserResponse = yield _Function.SaveBooking();
            break;
        case _GuestUpdateBookingInfo:
            _a.objUserResponse = yield _Function.UpdateBooking();
            break;
        case _GuestGenerateInvoice:
            _a.objUserResponse = yield _Function.GenerateInvoice();
            break;
        case _GuestGetMyBookinglist:
            _a.objUserResponse = yield _Function.GetUserBookingList();
            break;
        case _GetAllBookingListByAdmin:
            _a.objUserResponse = yield _Function.GetManagerBookingList();
            break;
        case _GetAllChatBookedUser:
            _a.objUserResponse = yield _Function.GetAllChatBookedUser();
            break;
        case _GetUserBookingDetail:
            _a.objUserResponse = yield _Function.GetUserBookingDetail();
            break;
        default:
            _a.objUserResponse = (0, common_1.GetUserErrorObj)('Server error: Wronge Function.', common_1.HttpStatusCodes.BAD_REQUEST);
            break;
    }
    return _a.objUserResponse;
});
class Functions {
    constructor() {
        this.objUserResponse = new common_1.UserResponse();
        this.req = null;
        this.res = null;
        this.next = null;
        this.objParam = new Type_1.TParam();
        this.Scheduler = new Cron_1.default();
        this.JobName = 'BookingScheduler';
        this.StartBookingSchedular = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const allBookings = yield BookingModel_1.Booking.aggregate([
                    {
                        $match: {
                            bookingStatus: BookingModel_1.enumBookingStatus.booked,
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
                const currentDate = (0, moment_1.default)();
                const Emails = [];
                allBookings.forEach((objBook) => {
                    const dateDiff = (0, moment_1.default)(objBook.date, 'DD/MM/YYYY');
                    const duration = moment_1.default.duration(dateDiff.diff(currentDate));
                    if (duration.asDays() === 2) {
                        Emails.push(objBook.email);
                    }
                });
                //  loop to emails add to que and send email
            }
            catch (error) { }
        });
        this.SaveBooking = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const objBooking = this.objParam.data;
                const _Booking = yield BookingModel_1.Booking.create({
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
                    adminID: objBooking.adminID,
                });
                yield _Booking.save();
                if (_Booking) {
                    const BookingListCache = common_1.Cache.getCacheData(Constant_1.CacheKey.user.bookingList(objBooking.userID));
                    const UserBookingCache = common_1.Cache.getCacheData(Constant_1.CacheKey.manager.userbookindetail(objBooking._id));
                    const GetCacheData = common_1.Cache.getCacheData(Constant_1.CacheKey.manager.Analytics.BookingBase(objBooking.adminID));
                    const ManagerBookingListCache = common_1.Cache.getCacheData(Constant_1.CacheKey.manager.bookingList(objBooking.adminID));
                    if (ManagerBookingListCache.error === '') {
                        common_1.Cache.ClearCache(Constant_1.CacheKey.manager.bookingList(objBooking.adminID));
                    }
                    if (GetCacheData.error === '') {
                        common_1.Cache.ClearCache(Constant_1.CacheKey.manager.Analytics.BookingBase(objBooking.adminID));
                    }
                    if (UserBookingCache.error === '') {
                        common_1.Cache.ClearCache(Constant_1.CacheKey.manager.userbookindetail(objBooking._id));
                    }
                    if (BookingListCache.error === '') {
                        common_1.Cache.ClearCache(Constant_1.CacheKey.user.bookingList(objBooking.userID));
                    }
                    const res = this.Scheduler.listJobs();
                    if (!res.message.includes(this.JobName)) {
                        this.Scheduler.addCronJob(this.JobName, this.Scheduler.CronTime().every5Seconds, () => this.StartBookingSchedular(), true);
                    }
                    this.objUserResponse = (0, common_1.GetUserSuccessObj)('Success: booking info store in DB', common_1.HttpStatusCodes.OK);
                }
                else {
                    this.objUserResponse = (0, common_1.GetUserErrorObj)('Fail to save initial data in DB', common_1.HttpStatusCodes.BAD_REQUEST);
                }
            }
            catch (error) {
                this.objUserResponse = (0, common_1.GetUserErrorObj)(error.message, common_1.HttpStatusCodes.BAD_REQUEST);
            }
            finally {
                return this.objUserResponse;
            }
        });
        this.UpdateBooking = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const { CancleDate, OptionalInfo, PaymentDetail, UserInfo, YourArrivalTime, bookingStatus, stayInfo, ReasonForCancle, BookingDate, propertyID, roomID, totalPay, userID, invoice, adminID, } = this.objParam.data;
                const _Booking = yield BookingModel_1.Booking.findOneAndUpdate({
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
                }, {
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
                });
                if (_Booking) {
                    if (bookingStatus === BookingModel_1.enumBookingStatus.booked) {
                        yield RoomModel_1.Room.findOneAndUpdate({
                            $and: [
                                {
                                    _id: roomID,
                                },
                                {
                                    adminID: adminID,
                                },
                            ],
                        }, {
                            $set: {
                                isAvailable: false,
                            },
                        });
                    }
                    common_1.Cache.ClearAllCache();
                    if (bookingStatus === BookingModel_1.enumBookingStatus.booked) {
                        this.objUserResponse = (0, common_1.GetUserSuccessObj)('Success: booking info Updated', common_1.HttpStatusCodes.OK);
                    }
                    else if (bookingStatus === BookingModel_1.enumBookingStatus.cancelled) {
                        this.objUserResponse = (0, common_1.GetUserErrorObj)('Your booking was cancled' + PaymentDetail.description, common_1.HttpStatusCodes.OK);
                    }
                }
            }
            catch (error) {
                this.objUserResponse = (0, common_1.GetUserErrorObj)(error.message, common_1.HttpStatusCodes.BAD_REQUEST);
            }
            finally {
                return this.objUserResponse;
            }
        });
        this.GenerateInvoice = () => __awaiter(this, void 0, void 0, function* () {
            var _b, _c, _d, _e;
            try {
                const { bookingID, userID } = this.objParam.data;
                const isVerified = yield (0, GuestVerification_1.checkGuestVerification)(userID);
                if (isVerified.error === '') {
                    const BookingData = yield BookingModel_1.Booking.findOne({
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
                        if ((BookingData === null || BookingData === void 0 ? void 0 : BookingData.invoice) === null) {
                            const RoomData = yield RoomModel_1.Room.findOne({ _id: BookingData.roomID }).populate('property').exec();
                            const InvoiceData = new Type_1.Invoice();
                            const Session = common_1.Crypt.Decryption(BookingData.PaymentDetail.Session).data;
                            InvoiceData.CreatedAt = new Date();
                            InvoiceData.CustomerInfo.Address = BookingData.UserInfo.address;
                            InvoiceData.CustomerInfo.City = BookingData.UserInfo.city;
                            InvoiceData.CustomerInfo.Country = BookingData.UserInfo.country;
                            InvoiceData.CustomerInfo.Email = BookingData.UserInfo.email;
                            InvoiceData.CustomerInfo.Name = BookingData.UserInfo.name;
                            InvoiceData.CustomerInfo.State = BookingData.UserInfo.state;
                            InvoiceData.CustomerInfo.Number = Number(BookingData.UserInfo.phone);
                            InvoiceData.InvoiceId = (0, uuid_1.uuid)();
                            InvoiceData.PaymentInfo.Currency = Session.currency;
                            InvoiceData.PaymentInfo.PaymentID = Session.id;
                            InvoiceData.PaymentInfo.PaymentStatus = Session.payment_status;
                            InvoiceData.PaymentInfo.PaymentType = Session.payment_method_types[0];
                            InvoiceData.PaymentInfo.TotalPay = Session.amount_total / 100;
                            InvoiceData.PaymentInfo.EmailID = (_b = Session.customer_details) === null || _b === void 0 ? void 0 : _b.email;
                            InvoiceData.PaymentInfo.HolderName = (_c = Session.customer_details) === null || _c === void 0 ? void 0 : _c.name;
                            InvoiceData.PaymentInfo.Country = (_e = (_d = Session.customer_details) === null || _d === void 0 ? void 0 : _d.address) === null || _e === void 0 ? void 0 : _e.country;
                            InvoiceData.PaymentInfo.PaymentDate = new Date(Session.consent * 1000).toString();
                            InvoiceData.BookingDetails.CheckIn = BookingData.stayInfo.checkIn;
                            InvoiceData.BookingDetails.CheckOut = BookingData.stayInfo.checkOut;
                            InvoiceData.BookingDetails.Adults = BookingData.stayInfo.adults;
                            InvoiceData.BookingDetails.Childrens = BookingData.stayInfo.childrens;
                            InvoiceData.BookingDetails.TotalStay = BookingData.stayInfo.totalStay;
                            InvoiceData.BookingDetails.TotalPay = `${BookingData.totalPay}`;
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
                                InvoiceData.RoomInfo.RoomNo = RoomData.roomNumber;
                            }
                            try {
                                const doc = new pdfkit_1.default({ size: 'A4', margin: 50 });
                                const res = new common_1.ProjectResponse();
                                const buffers = [];
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
                                    .text(`Payment Date: ${new Date(InvoiceData.PaymentInfo.PaymentDate).toLocaleDateString()}`, rightColumnX, yPosRight + lineHeight * 7)
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
                                    .text(`Room Price: ${InvoiceData.RoomInfo.RoomPrice}`, leftColumnX, yPos + lineHeight)
                                    .text(`Room no: ${InvoiceData.RoomInfo.RoomNo}`, leftColumnX, yPos + lineHeight * 2);
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
                                const pdfData = yield new Promise((resolve, reject) => {
                                    doc.on('data', (chunk) => buffers.push(chunk));
                                    doc.on('end', () => resolve(buffers));
                                    doc.on('error', (err) => reject(err));
                                });
                                const pdfBase64 = Buffer.concat(pdfData).toString('base64');
                                const isUpdated = yield BookingModel_1.Booking.findOneAndUpdate({ $and: [{ _id: bookingID }, { userID: userID }] }, { $set: { invoice: 'data:application/pdf;base64,' + pdfBase64 } }, { new: true });
                                if (isUpdated !== null) {
                                    const bookingCache = common_1.Cache.getCacheData(Constant_1.CacheKey.user.bookingList(userID));
                                    if (bookingCache.error === '') {
                                        common_1.Cache.ClearCache(Constant_1.CacheKey.user.bookingList(userID));
                                    }
                                    this.objUserResponse = (0, common_1.GetUserSuccessObj)(isUpdated, common_1.HttpStatusCodes.OK);
                                }
                                else {
                                    this.objUserResponse = (0, common_1.GetUserErrorObj)('Booking not found or Invoice update failed', common_1.HttpStatusCodes.INTERNAL_SERVER_ERROR);
                                }
                            }
                            catch (error) {
                                this.objUserResponse = (0, common_1.GetUserErrorObj)(error.message, common_1.HttpStatusCodes.INTERNAL_SERVER_ERROR);
                            }
                        }
                        else {
                            this.objUserResponse = (0, common_1.GetUserErrorObj)('Your Invoice is already been generated', common_1.HttpStatusCodes.NOT_ACCEPTABLE);
                        }
                    }
                    else {
                        this.objUserResponse = (0, common_1.GetUserErrorObj)('No such booking info available to generate invoice', common_1.HttpStatusCodes.NOT_ACCEPTABLE);
                    }
                }
                else {
                    this.objUserResponse = (0, common_1.GetUserErrorObj)(isVerified.error, common_1.HttpStatusCodes.NOT_ACCEPTABLE);
                }
            }
            catch (error) {
                this.objUserResponse = (0, common_1.GetUserErrorObj)(error.message, common_1.HttpStatusCodes.BAD_REQUEST);
            }
            finally {
                return this.objUserResponse;
            }
        });
        this.GetUserBookingList = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const userID = this.objParam.data;
                const isUser = yield (0, GuestVerification_1.checkGuestVerification)(userID);
                if (isUser.error === '') {
                    const BookingListCache = common_1.Cache.getCacheData(Constant_1.CacheKey.user.bookingList(userID));
                    if (BookingListCache.error === '') {
                        this.objUserResponse = (0, common_1.GetUserSuccessObj)(BookingListCache.data, common_1.HttpStatusCodes.OK);
                    }
                    else {
                        const BookingList = yield BookingModel_1.Booking.aggregate([
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
                        common_1.Cache.SetCache(Constant_1.CacheKey.user.bookingList(userID), BookingList);
                        this.objUserResponse = (0, common_1.GetUserSuccessObj)(BookingList, common_1.HttpStatusCodes.OK);
                    }
                }
                else {
                    this.objUserResponse = (0, common_1.GetUserErrorObj)(isUser.error, common_1.HttpStatusCodes.NOT_ACCEPTABLE);
                }
            }
            catch (error) {
                this.objUserResponse = (0, common_1.GetUserErrorObj)(error.message, common_1.HttpStatusCodes.BAD_REQUEST);
            }
            finally {
                return this.objUserResponse;
            }
        });
        this.GetManagerBookingList = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const adminID = this.objParam.data;
                const isAdmin = yield (0, AdiminVerification_1.checkAdminVerification)(adminID);
                if (isAdmin.error === '') {
                    const BookingListCache = common_1.Cache.getCacheData(Constant_1.CacheKey.manager.bookingList(adminID));
                    if (BookingListCache.error === '') {
                        this.objUserResponse = (0, common_1.GetUserSuccessObj)(BookingListCache.data, common_1.HttpStatusCodes.OK);
                    }
                    else {
                        const BookingList = yield BookingModel_1.Booking.aggregate([
                            {
                                $match: {
                                    adminID: adminID,
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
                                    path: '$property',
                                    preserveNullAndEmptyArrays: true,
                                },
                            },
                            {
                                $unwind: {
                                    path: '$room',
                                    preserveNullAndEmptyArrays: true,
                                },
                            },
                        ]);
                        common_1.Cache.SetCache(Constant_1.CacheKey.manager.bookingList(adminID), BookingList);
                        this.objUserResponse = (0, common_1.GetUserSuccessObj)(BookingList, common_1.HttpStatusCodes.OK);
                    }
                }
                else {
                    this.objUserResponse = (0, common_1.GetUserErrorObj)(isAdmin.error, common_1.HttpStatusCodes.NOT_ACCEPTABLE);
                }
            }
            catch (error) {
                this.objUserResponse = (0, common_1.GetUserErrorObj)(error.message, common_1.HttpStatusCodes.BAD_REQUEST);
            }
            finally {
                return this.objUserResponse;
            }
        });
        this.GetAllChatBookedUser = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const adminID = this.objParam.data;
                const isAdmin = yield (0, AdiminVerification_1.checkAdminVerification)(adminID);
                if (isAdmin.error === '') {
                    const BookingListCache = common_1.Cache.getCacheData(Constant_1.CacheKey.manager.chatUserbaseBooking(adminID));
                    if (BookingListCache.error === '') {
                        this.objUserResponse = (0, common_1.GetUserSuccessObj)(BookingListCache.data, common_1.HttpStatusCodes.OK);
                    }
                    else {
                        const BookingList = yield BookingModel_1.Booking.aggregate([
                            {
                                $match: {
                                    adminID: adminID,
                                },
                            },
                            {
                                $addFields: {
                                    userID: { $toObjectId: '$userID' },
                                },
                            },
                            {
                                $addFields: {
                                    PropertyID: { $toObjectId: '$propertyID' },
                                },
                            },
                            {
                                $lookup: {
                                    from: 'users',
                                    localField: 'userID',
                                    foreignField: '_id',
                                    as: 'user',
                                },
                            },
                            {
                                $lookup: {
                                    from: 'properties',
                                    localField: 'PropertyID',
                                    foreignField: '_id',
                                    as: 'property',
                                },
                            },
                            {
                                $unwind: {
                                    path: '$user',
                                    preserveNullAndEmptyArrays: true,
                                },
                            },
                            {
                                $unwind: {
                                    path: '$property',
                                    preserveNullAndEmptyArrays: true,
                                },
                            },
                            {
                                $addFields: {
                                    PropertyName: '$property.name',
                                },
                            },
                            {
                                $project: {
                                    user: 1,
                                    propertyID: 1,
                                    _id: 1,
                                    adminID: 1,
                                    PropertyName: 1,
                                },
                            },
                        ]);
                        common_1.Cache.SetCache(Constant_1.CacheKey.manager.chatUserbaseBooking(adminID), BookingList);
                        this.objUserResponse = (0, common_1.GetUserSuccessObj)(BookingList, common_1.HttpStatusCodes.OK);
                    }
                }
                else {
                    this.objUserResponse = (0, common_1.GetUserErrorObj)(isAdmin.error, common_1.HttpStatusCodes.NOT_ACCEPTABLE);
                }
            }
            catch (error) {
                this.objUserResponse = (0, common_1.GetUserErrorObj)(error.message, common_1.HttpStatusCodes.BAD_REQUEST);
            }
            finally {
                return this.objUserResponse;
            }
        });
        this.GetUserBookingDetail = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const { BookingID, adminID } = this.objParam.data;
                const idAdmin = yield (0, AdiminVerification_1.checkAdminVerification)(adminID);
                if (idAdmin.error === '') {
                    const UserBookingCache = common_1.Cache.getCacheData(Constant_1.CacheKey.manager.userbookindetail(BookingID));
                    if (UserBookingCache.error === '') {
                        this.objUserResponse = (0, common_1.GetUserSuccessObj)(UserBookingCache.data, common_1.HttpStatusCodes.OK);
                    }
                    else {
                        const objBooking = yield BookingModel_1.Booking.aggregate([
                            {
                                $match: {
                                    $and: [
                                        {
                                            adminID: adminID,
                                        },
                                        {
                                            _id: new mongoose_1.default.Types.ObjectId(BookingID),
                                        },
                                    ],
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
                        common_1.Cache.SetCache(Constant_1.CacheKey.manager.userbookindetail(BookingID), objBooking[0]);
                        this.objUserResponse = (0, common_1.GetUserSuccessObj)(objBooking[0], common_1.HttpStatusCodes.OK);
                    }
                }
                else {
                    this.objUserResponse = (0, common_1.GetUserErrorObj)(idAdmin.error, common_1.HttpStatusCodes.NOT_ACCEPTABLE);
                }
            }
            catch (error) {
                this.objUserResponse = (0, common_1.GetUserErrorObj)(error.message, common_1.HttpStatusCodes.BAD_REQUEST);
            }
            finally {
                return this.objUserResponse;
            }
        });
    }
}
