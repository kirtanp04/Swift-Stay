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
exports.PaymentFunction = void 0;
const stripe_1 = __importDefault(require("stripe"));
const common_1 = require("../common");
const Constant_1 = require("../Constant");
const env_1 = require("../env");
const GuestVerification_1 = require("../middleware/GuestVerification");
const BookingModel_1 = require("../models/BookingModel");
const PropertyModel_1 = require("../models/PropertyModel");
const RoomModel_1 = require("../models/RoomModel");
const UserModel_1 = require("../models/UserModel");
const Email_1 = require("../service/Email");
const Type_1 = require("../types/Type");
const Booking_1 = require("./Booking");
// guest
const _GuestCheckOut = Constant_1.Param.function.guest.payment.CheckOut;
const _GuestWebHook = Constant_1.Param.function.guest.payment.WebHook;
const _GuestUPIPayment = Constant_1.Param.function.guest.payment.UPIPayment;
class PaymentFunction {
}
exports.PaymentFunction = PaymentFunction;
_a = PaymentFunction;
PaymentFunction.objUserResponse = new common_1.UserResponse();
PaymentFunction.findFunction = (objParam, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let _Function = new Functions();
    _Function.req = req;
    _Function.res = res;
    _Function.next = next;
    _Function.objParam = objParam;
    switch (objParam.function) {
        case _GuestCheckOut:
            _a.objUserResponse = yield _Function.PaymentCheckOut();
            break;
        case _GuestWebHook:
            _a.objUserResponse = yield _Function.webhookHandler();
            break;
        case _GuestUPIPayment:
            _a.objUserResponse = yield _Function.UPIPayment();
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
        this.PaymentCheckOut = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingInfo = this.objParam.data;
                const isVerified = yield (0, GuestVerification_1.checkGuestVerification)(bookingInfo.userID);
                if (isVerified.error === '') {
                    const PropertyDetail = yield PropertyModel_1.Property.findOne({ _id: bookingInfo.propertyID });
                    const encryptedMetaData = splitIntoFourParts(common_1.Crypt.Encryption(bookingInfo).data);
                    if (PropertyDetail !== undefined) {
                        try {
                            const _Stripe = new stripe_1.default(env_1.SecrtKey.STRIPE.SECRET_KEY);
                            const Session = yield _Stripe.checkout.sessions.create({
                                payment_method_types: ['card'],
                                mode: 'payment',
                                success_url: env_1.SecrtKey.FRONTEND_URL.GUEST,
                                cancel_url: env_1.SecrtKey.FRONTEND_URL.GUEST,
                                line_items: [
                                    {
                                        price_data: {
                                            currency: 'inr',
                                            product_data: {
                                                name: PropertyDetail === null || PropertyDetail === void 0 ? void 0 : PropertyDetail.name,
                                                description: PropertyDetail === null || PropertyDetail === void 0 ? void 0 : PropertyDetail.description,
                                                images: (PropertyDetail === null || PropertyDetail === void 0 ? void 0 : PropertyDetail.images.length) > 0 ? PropertyDetail === null || PropertyDetail === void 0 ? void 0 : PropertyDetail.images : undefined,
                                            },
                                            unit_amount: bookingInfo.totalPay * 100,
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
                            const _Param = new Type_1.TParam();
                            _Param.Broker = Constant_1.Param.broker.guest.booking;
                            _Param.function = Constant_1.Param.function.guest.booking.SaveBookingInfo;
                            bookingInfo.PaymentDetail.PaymentStatus = BookingModel_1.PaymentStatus.pending;
                            bookingInfo.totalPay = Session.amount_total / 100;
                            bookingInfo.bookingStatus = BookingModel_1.enumBookingStatus.pending;
                            _Param.data = bookingInfo;
                            const _res = yield Booking_1.BookingFunction.findFunction(_Param, this.req, this.res, this.next);
                            if (!_res.isError) {
                                this.objUserResponse = (0, common_1.GetUserSuccessObj)(Session.id, common_1.HttpStatusCodes.OK);
                            }
                            else {
                                this.objUserResponse = (0, common_1.GetUserErrorObj)(_res.Message, common_1.HttpStatusCodes.BAD_REQUEST);
                            }
                        }
                        catch (error) {
                            this.objUserResponse = (0, common_1.GetUserErrorObj)(error.message, common_1.HttpStatusCodes.BAD_REQUEST);
                        }
                    }
                    else {
                        this.objUserResponse = (0, common_1.GetUserErrorObj)('The property of which you are booking is not available.', common_1.HttpStatusCodes.NOT_ACCEPTABLE);
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
        this.webhookHandler = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const stripe = new stripe_1.default(env_1.SecrtKey.STRIPE.SECRET_KEY);
                const payloadString = JSON.stringify(this.objParam.data, null, 2);
                const signature = this.req.headers['stripe-signature'];
                const header = stripe.webhooks.generateTestHeaderString({
                    payload: payloadString,
                    secret: env_1.SecrtKey.STRIPE.WEBHOOK_SECRET,
                    // signature: signature
                });
                try {
                    const event = stripe.webhooks.constructEvent(payloadString, header, env_1.SecrtKey.STRIPE.WEBHOOK_SECRET);
                    if (event.type === 'checkout.session.completed') {
                        try {
                            const paymentIntent = event.data.object;
                            const _metadata = paymentIntent.metadata;
                            const _EncryptBookingInfo = _metadata.key_1 + _metadata.key_2 + _metadata.key_3 + _metadata.key_4;
                            let _bookingInfo = common_1.Crypt.Decryption(_EncryptBookingInfo).data;
                            const _Param = new Type_1.TParam();
                            _Param.Broker = Constant_1.Param.broker.guest.booking;
                            _Param.function = Constant_1.Param.function.guest.booking.UpdateBookingInfo;
                            _bookingInfo.PaymentDetail.PaymentID = paymentIntent.id;
                            _bookingInfo.PaymentDetail.PaymentStatus = BookingModel_1.PaymentStatus.paid;
                            _bookingInfo.PaymentDetail.description = 'Payment was successfully done';
                            _bookingInfo.PaymentDetail.Session = common_1.Crypt.Encryption(paymentIntent).data;
                            _bookingInfo.bookingStatus = BookingModel_1.enumBookingStatus.booked;
                            _Param.data = _bookingInfo;
                            const _res = yield Booking_1.BookingFunction.findFunction(_Param, this.req, this.res, this.next);
                            if (!_res.isError) {
                                const user = yield UserModel_1.User.findOne({ _id: _bookingInfo.userID });
                                const room = yield RoomModel_1.Room.findOne({ _id: _bookingInfo.roomID }).populate('property').exec();
                                if (room && user) {
                                    const _Email = new Email_1.Email({});
                                    _Email.from = room.property.name;
                                    _Email.to = user.email;
                                    _Email.subject = 'Success for Booking' + ' ' + room.property.name;
                                    _Email.html = Constant_1.EmailTemplate.Successbooking({
                                        objBooking: _bookingInfo,
                                        objRoom: room,
                                    });
                                    yield _Email.sendEmail(() => { }, (err) => {
                                        this.objUserResponse = (0, common_1.GetUserErrorObj)(err, common_1.HttpStatusCodes.BAD_REQUEST);
                                    });
                                }
                            }
                        }
                        catch (error) {
                            this.objUserResponse = (0, common_1.GetUserErrorObj)(error.message, common_1.HttpStatusCodes.BAD_REQUEST);
                        }
                    }
                    if (event.type === 'checkout.session.async_payment_failed') {
                        const failedPaymentIntent = event.data.object;
                        const failed_metadata = failedPaymentIntent.metadata;
                        const failed_EncryptBookingInfo = failed_metadata.key_1 + failed_metadata.key_2 + failed_metadata.key_3 + failed_metadata.key_4;
                        let Failed_BookingInfo = common_1.Crypt.Decryption(failed_EncryptBookingInfo).data;
                        const Failed_Param = new Type_1.TParam();
                        Failed_Param.Broker = Constant_1.Param.broker.guest.booking;
                        Failed_Param.function = Constant_1.Param.function.guest.booking.UpdateBookingInfo;
                        const paymentError = (yield stripe.paymentIntents.retrieve(failedPaymentIntent.id)).last_payment_error;
                        Failed_BookingInfo.PaymentDetail.failPaymentID = failedPaymentIntent.id;
                        Failed_BookingInfo.PaymentDetail.PaymentStatus = BookingModel_1.PaymentStatus.fail;
                        Failed_BookingInfo.PaymentDetail.description = (paymentError === null || paymentError === void 0 ? void 0 : paymentError.message) || 'Fail to pay';
                        Failed_BookingInfo.bookingStatus = BookingModel_1.enumBookingStatus.cancelled;
                        Failed_BookingInfo.PaymentDetail.Session = common_1.Crypt.Encryption(failedPaymentIntent).data;
                        Failed_Param.data = Failed_BookingInfo;
                        const Failed_res = yield Booking_1.BookingFunction.findFunction(Failed_Param, this.req, this.res, this.next);
                        if (!Failed_res.isError) {
                            const user = yield UserModel_1.User.findOne({ _id: Failed_BookingInfo.userID });
                            const property = yield PropertyModel_1.Property.findOne({ _id: Failed_BookingInfo.propertyID });
                            if (property !== null && user !== null) {
                                const _Email = new Email_1.Email({});
                                _Email.from = property.name;
                                _Email.to = user.email;
                                _Email.subject = 'Fail to Book' + ' ' + property.name;
                                _Email.html = Constant_1.EmailTemplate.FailedBooking({
                                    propertyName: property.name,
                                    failReason: Failed_res.Message,
                                });
                                yield _Email.sendEmail(() => { }, (err) => {
                                    this.objUserResponse = (0, common_1.GetUserErrorObj)(err, common_1.HttpStatusCodes.BAD_REQUEST);
                                });
                            }
                        }
                    }
                }
                catch (err) {
                    this.objUserResponse = (0, common_1.GetUserErrorObj)(err.message, common_1.HttpStatusCodes.BAD_REQUEST);
                }
            }
            catch (error) {
                this.objUserResponse = (0, common_1.GetUserErrorObj)(error.message, common_1.HttpStatusCodes.BAD_REQUEST);
            }
            finally {
                return this.objUserResponse;
            }
        });
        this.UPIPayment = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingInfo = this.objParam.data;
                const isVerified = yield (0, GuestVerification_1.checkGuestVerification)(bookingInfo.userID);
                if (isVerified.error === '') {
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
    }
}
function splitIntoFourParts(str) {
    const partLength = Math.ceil(str.length / 4);
    const part1 = str.substring(0, partLength);
    const part2 = str.substring(partLength, partLength * 2);
    const part3 = str.substring(partLength * 2, partLength * 3);
    const part4 = str.substring(partLength * 3);
    return [part1, part2, part3, part4];
}
