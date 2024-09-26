"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = exports.BookingClass = exports.PaymentStatus = exports.enumBookingStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var enumBookingStatus;
(function (enumBookingStatus) {
    enumBookingStatus["pending"] = "pending";
    enumBookingStatus["booked"] = "booked";
    enumBookingStatus["checked_in"] = "checked_in";
    enumBookingStatus["checked_out"] = "checked_out";
    enumBookingStatus["cancelled"] = "cancelled";
})(enumBookingStatus || (exports.enumBookingStatus = enumBookingStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["pending"] = "pending";
    PaymentStatus["paid"] = "paid";
    PaymentStatus["fail"] = "fail";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
class BookingClass {
    constructor() {
        this._id = '';
        this.propertyID = '';
        this.roomID = '';
        this.userID = '';
        this.adminID = '';
        this.UserInfo = new UserInfo();
        this.stayInfo = new StayInfo();
        this.totalPay = null;
        this.currency = '';
        this.bookingStatus = enumBookingStatus.pending;
        this.PaymentDetail = new PaymentDetail();
        this.invoice = null;
        this.OptionalInfo = new OptionalInfo();
        this.YourArrivalTime = '';
        this.BookingDate = '';
        this.CancleDate = null;
        this.ReasonForCancle = null;
    }
}
exports.BookingClass = BookingClass;
const BookingSchema = new mongoose_1.Schema({
    propertyID: { type: String, required: [true, 'Property is required.'] },
    roomID: { type: String, required: [true, 'Room is required.'] },
    userID: { type: String, required: [true, 'User is required.'] },
    adminID: { type: String, required: [true, 'Admin is required.'] },
    UserInfo: {
        name: { type: String, required: [true, 'User name is required.'] },
        email: { type: String, required: [true, 'User email is required.'] },
        address: { type: String, required: [true, 'User address is required.'] },
        city: { type: String, required: [true, 'User city is required.'] },
        ZipCode: { type: String, required: [true, 'User ZipCode is required.'] },
        country: { type: String, required: [true, 'User country is required.'] },
        state: { type: String, required: [true, 'User state is required.'] },
        phone: { type: Number, required: [true, 'User phone is required.'] },
    },
    stayInfo: {
        checkIn: { type: String, required: [true, 'User checkIn is required.'] },
        checkOut: { type: String, required: [true, 'User checkOut is required.'] },
        adults: { type: Number, required: [true, 'User adults is required.'] },
        childrens: { type: Number, required: [true, 'User childrens is required.'] },
        totalStay: { type: String, required: [true, 'User totalStay is required.'] },
    },
    totalPay: { type: Number, required: [true, 'Total payment getting empty is required.'] },
    currency: { type: String },
    bookingStatus: { type: String },
    PaymentDetail: {
        PaymentID: { type: String || null, default: null },
        failPaymentID: { type: String || null, default: null },
        PaymentStatus: { type: String, enum: Object.values(PaymentStatus) },
        description: { type: String || null, default: null },
        Session: { type: String || null, default: null },
    },
    invoice: { type: String || null, default: null },
    OptionalInfo: {
        WhoAreYouBookingFor: { type: String },
        AreYouTravellingForWork: { type: String },
        SpecialRequests: { type: String },
        companyName: { type: String },
    },
    YourArrivalTime: { type: String },
    BookingDate: { type: String },
    CancleDate: { type: String || null, default: null },
    ReasonForCancle: { type: String || null, default: null },
});
BookingSchema.index({ userID: 1 });
exports.Booking = mongoose_1.default.model('Booking', BookingSchema);
class StayInfo {
    constructor() {
        this.checkIn = null;
        this.checkOut = null;
        this.adults = null;
        this.childrens = null;
        this.totalStay = null;
    }
}
class UserInfo {
    constructor() {
        this.name = '';
        this.email = '';
        this.address = '';
        this.city = '';
        this.ZipCode = '';
        this.country = '';
        this.state = '';
        this.phone = null;
    }
}
class OptionalInfo {
    constructor() {
        this.WhoAreYouBookingFor = '';
        this.AreYouTravellingForWork = '';
        this.SpecialRequests = '';
        this.companyName = '';
    }
}
class PaymentDetail {
    constructor() {
        this.PaymentID = null;
        this.failPaymentID = null;
        this.PaymentStatus = PaymentStatus.pending;
        this.description = null;
        this.Session = null;
    }
}
