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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticFunction = void 0;
const common_1 = require("../common");
const Constant_1 = require("../Constant");
const AdiminVerification_1 = require("../middleware/AdiminVerification");
const Type_1 = require("../types/Type");
const BookingModel_1 = require("../models/BookingModel");
const PropertyModel_1 = require("../models/PropertyModel");
const Review_1 = require("../models/Review");
// Admin
const _ManagerGetOverviewMetrics = Constant_1.Param.function.manager.analytics.GetOverviewMetrics;
const _ManagerPropertyByStates = Constant_1.Param.function.manager.analytics.PropertybyStates;
const _ManagerGetPropertyProfitByMonth = Constant_1.Param.function.manager.analytics.GetPropertyProfitByMonth;
class AnalyticFunction {
}
exports.AnalyticFunction = AnalyticFunction;
_a = AnalyticFunction;
AnalyticFunction.objUserResponse = new common_1.UserResponse();
AnalyticFunction.findFunction = (objParam, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let _Function = new Functions();
    _Function.req = req;
    _Function.res = res;
    _Function.next = next;
    _Function.objParam = objParam;
    switch (objParam.function) {
        case _ManagerGetOverviewMetrics:
            _a.objUserResponse = yield _Function.GetOverviewMetrics();
            break;
        case _ManagerPropertyByStates:
            _a.objUserResponse = yield _Function.getPropertyByState();
            break;
        case _ManagerGetPropertyProfitByMonth:
            _a.objUserResponse = yield _Function.GetPropertyProfitByMonth();
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
        this.adminID = null;
        this.req = null;
        this.res = null;
        this.next = null;
        this.objParam = new Type_1.TParam();
        // Overview Matrics
        // row 1
        this.getTotalBooking = () => __awaiter(this, void 0, void 0, function* () {
            if (this.adminID === null)
                return 0;
            const TotalBookings = yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const TotalBookingCount = yield BookingModel_1.Booking.aggregate([
                        {
                            $match: {
                                bookingStatus: BookingModel_1.enumBookingStatus.booked,
                            },
                        },
                        {
                            $addFields: {
                                propertyID: { $toObjectId: '$propertyID' },
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
                            $unwind: {
                                path: '$property',
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $match: {
                                'property.adminID': this.adminID,
                            },
                        },
                        {
                            $count: 'totalDocuments',
                        },
                        {
                            $project: {
                                totalDocuments: 1,
                            },
                        },
                    ]);
                    resolve(TotalBookingCount[0].totalDocuments);
                }
                catch (error) {
                    reject(error.message);
                }
            }));
            return TotalBookings;
        });
        this.getTotalRevenue = () => __awaiter(this, void 0, void 0, function* () {
            if (this.adminID === null)
                return '';
            const TotalRevenue = yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const TotalRevenueGenerated = yield BookingModel_1.Booking.aggregate([
                        {
                            $addFields: {
                                propertyID: { $toObjectId: '$propertyID' },
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
                            $unwind: {
                                path: '$property',
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $match: {
                                'property.adminID': this.adminID,
                            },
                        },
                        {
                            $group: {
                                _id: null,
                                TotalRevenue: { $sum: '$totalPay' },
                                currency: { $first: '$currency' },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                RevenueGenerated: {
                                    $concat: ['$currency', '', { $toString: '$TotalRevenue' }],
                                },
                            },
                        },
                    ]);
                    resolve(TotalRevenueGenerated[0].RevenueGenerated);
                }
                catch (error) {
                    reject(error.message);
                }
            }));
            return TotalRevenue;
        });
        this.getTotalPropertyAndRoom = () => __awaiter(this, void 0, void 0, function* () {
            if (this.adminID === null)
                return { property: 0, room: 0 };
            const TotalPropertyAndRoom = yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const Totalcount = yield PropertyModel_1.Property.aggregate([
                        {
                            $match: {
                                adminID: this.adminID,
                            },
                        },
                        {
                            $group: {
                                _id: null,
                                property: { $sum: 1 },
                                room: { $sum: { $size: '$rooms' } },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                property: 1,
                                room: 1,
                            },
                        },
                    ]);
                    resolve(Totalcount[0]);
                }
                catch (error) {
                    reject(error.message);
                }
            }));
            return TotalPropertyAndRoom;
        });
        //row 2
        this.IncreaseInRevenue = () => __awaiter(this, void 0, void 0, function* () {
            if (this.adminID === null)
                return [];
            const IncreaseRevenue = yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const IncreasedRevenue = yield BookingModel_1.Booking.aggregate([
                        {
                            $match: {
                                bookingStatus: BookingModel_1.enumBookingStatus.booked,
                            },
                        },
                        {
                            $addFields: {
                                propertyID: { $toObjectId: '$propertyID' },
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
                            $unwind: {
                                path: '$property',
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $match: {
                                'property.adminID': this.adminID,
                            },
                        },
                        {
                            $addFields: {
                                parsedBookingDate: {
                                    $dateFromString: {
                                        dateString: '$BookingDate',
                                        format: '%d/%m/%Y',
                                    },
                                },
                                currentDate: new Date(),
                            },
                        },
                        {
                            $match: {
                                $expr: {
                                    $eq: [{ $year: '$parsedBookingDate' }, { $year: '$currentDate' }],
                                },
                            },
                        },
                        {
                            $addFields: {
                                yearMonth: {
                                    $dateToString: { format: '%Y-%m', date: '$parsedBookingDate' },
                                },
                                monthName: {
                                    $dateToString: { format: '%B', date: '$parsedBookingDate' },
                                },
                                year: {
                                    $year: '$currentDate',
                                },
                            },
                        },
                        {
                            $group: {
                                _id: '$yearMonth',
                                totalPaySum: { $sum: '$totalPay' },
                                currency: { $first: '$currency' },
                                monthName: { $first: '$monthName' },
                                year: { $first: '$year' },
                            },
                        },
                        {
                            $sort: { _id: 1 },
                        },
                        {
                            $project: {
                                year: 1,
                                monthName: 1,
                                totalPaySum: 1,
                                currency: 1,
                                _id: 0,
                            },
                        },
                    ]);
                    resolve(IncreasedRevenue);
                }
                catch (error) {
                    reject(error.message);
                }
            }));
            return IncreaseRevenue;
        });
        this.IncreaseInBooking = () => __awaiter(this, void 0, void 0, function* () {
            if (this.adminID === null)
                return [];
            const IncreaseRevenue = yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const IncreasedBooking = yield BookingModel_1.Booking.aggregate([
                        {
                            $match: {
                                bookingStatus: BookingModel_1.enumBookingStatus.booked,
                            },
                        },
                        {
                            $addFields: {
                                propertyID: { $toObjectId: '$propertyID' },
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
                            $unwind: {
                                path: '$property',
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $match: {
                                'property.adminID': this.adminID,
                            },
                        },
                        {
                            $addFields: {
                                parsedBookingDate: {
                                    $dateFromString: {
                                        dateString: '$BookingDate',
                                        format: '%d/%m/%Y',
                                    },
                                },
                                currentDate: new Date(),
                            },
                        },
                        {
                            $match: {
                                $expr: {
                                    $eq: [{ $year: '$parsedBookingDate' }, { $year: '$currentDate' }],
                                },
                            },
                        },
                        {
                            $addFields: {
                                yearMonth: {
                                    $dateToString: { format: '%Y-%m', date: '$parsedBookingDate' },
                                },
                                monthName: {
                                    $dateToString: { format: '%B', date: '$parsedBookingDate' },
                                },
                                year: {
                                    $year: '$currentDate',
                                },
                            },
                        },
                        {
                            $group: {
                                _id: '$yearMonth',
                                bookingCount: { $sum: 1 },
                                monthName: { $first: '$monthName' },
                                currency: { $first: '$currency' },
                                year: { $first: '$year' },
                            },
                        },
                        {
                            $sort: { _id: 1 },
                        },
                        {
                            $project: {
                                _id: 0,
                                monthName: 1,
                                bookingCount: 1,
                                currency: 1,
                                year: 1,
                            },
                        },
                    ]);
                    resolve(IncreasedBooking);
                }
                catch (error) {
                    reject(error.message);
                }
            }));
            return IncreaseRevenue;
        });
        //row 3
        this.getTopPropertyByBooking = () => __awaiter(this, void 0, void 0, function* () {
            if (this.adminID === null)
                return [];
            const TotalProperties = yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const Data = yield BookingModel_1.Booking.aggregate([
                        {
                            $match: {
                                bookingStatus: BookingModel_1.enumBookingStatus.booked,
                            },
                        },
                        {
                            $addFields: {
                                propertyID: { $toObjectId: '$propertyID' },
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
                            $unwind: {
                                path: '$property',
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $match: {
                                'property.adminID': this.adminID,
                            },
                        },
                        {
                            $group: {
                                _id: '$property._id',
                                count: { $sum: 1 },
                                name: { $first: '$property.name' },
                            },
                        },
                        {
                            $sort: {
                                count: -1,
                            },
                        },
                        {
                            $limit: 5,
                        },
                        {
                            $project: {
                                _id: 0,
                                name: 1,
                                count: 1,
                            },
                        },
                    ]);
                    resolve(Data);
                }
                catch (error) {
                    reject(error.message);
                }
            }));
            return TotalProperties;
        });
        this.getAverageReviewsWithProperty = () => __awaiter(this, void 0, void 0, function* () {
            if (this.adminID === null)
                return [];
            const propertyWithAvgReview = yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const res = yield Review_1.Review.aggregate([
                        {
                            $addFields: {
                                propertyID: { $toObjectId: '$property' },
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
                            $addFields: {
                                propertyInfo: {
                                    $first: '$property',
                                },
                            },
                        },
                        {
                            $match: {
                                'propertyInfo.adminID': this.adminID,
                            },
                        },
                        {
                            $addFields: {
                                AvgReview: {
                                    $avg: {
                                        $map: {
                                            input: '$reviewInfo',
                                            as: 'review',
                                            in: '$$review.rating',
                                        },
                                    },
                                },
                                propertyName: '$propertyInfo.name',
                            },
                        },
                        {
                            $addFields: {
                                AvgReview: { $round: ['$AvgReview', 1] },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                propertyName: 1,
                                AvgReview: 1,
                            },
                        },
                    ]);
                    resolve(res);
                }
                catch (error) {
                    reject(error.message);
                }
            }));
            return propertyWithAvgReview;
        });
        this.getPropertyByState = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const { adminID, country } = this.objParam.data;
                const checkUser = yield (0, AdiminVerification_1.checkAdminVerification)(adminID);
                if (checkUser.error === '') {
                    const propertyByStates = yield PropertyModel_1.Property.aggregate([
                        {
                            $match: {
                                $and: [
                                    {
                                        adminID: adminID,
                                    },
                                    {
                                        country: country,
                                    },
                                ],
                            },
                        },
                        {
                            $group: {
                                _id: '$state',
                                count: {
                                    $sum: 1,
                                },
                            },
                        },
                        {
                            $addFields: {
                                state: '$_id',
                            },
                        },
                        {
                            $project: {
                                state: 1,
                                count: 1,
                                _id: 0,
                            },
                        },
                    ]);
                    this.objUserResponse = (0, common_1.GetUserSuccessObj)(propertyByStates, common_1.HttpStatusCodes.OK);
                }
                else {
                    this.objUserResponse = (0, common_1.GetUserErrorObj)(checkUser.error, common_1.HttpStatusCodes.NOT_ACCEPTABLE);
                }
            }
            catch (error) {
                this.objUserResponse = (0, common_1.GetUserErrorObj)(error.message, common_1.HttpStatusCodes.BAD_REQUEST);
            }
            finally {
                return this.objUserResponse;
            }
        });
        this.GetOverviewMetrics = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const adminID = this.objParam.data;
                const checkUser = yield (0, AdiminVerification_1.checkAdminVerification)(adminID);
                if (checkUser.error === '') {
                    this.adminID = adminID;
                    const GetCacheData = common_1.Cache.getCacheData(Constant_1.CacheKey.manager.Analytics.BookingBase(adminID));
                    if (GetCacheData.error === '') {
                        this.objUserResponse = (0, common_1.GetUserSuccessObj)(GetCacheData.data, common_1.HttpStatusCodes.OK);
                    }
                    else {
                        yield Promise.all([
                            this.getTotalBooking(),
                            this.getTotalRevenue(),
                            this.getTotalPropertyAndRoom(),
                            this.IncreaseInRevenue(),
                            this.IncreaseInBooking(),
                            this.getTopPropertyByBooking(),
                            this.getAverageReviewsWithProperty(),
                        ])
                            .then((res) => {
                            const _Analytic = new Type_1.Analytic();
                            _Analytic.TotalBookings = res[0];
                            _Analytic.TotalRevenue = res[1];
                            _Analytic.TotalPropertyandRooms = res[2];
                            _Analytic.RevenueAnalytics = res[3];
                            _Analytic.BookingAnalytics = res[4];
                            _Analytic.TopPropertiesByBooking = res[5];
                            _Analytic.AllPropertyWithAvgReview = res[6];
                            common_1.Cache.SetCache(Constant_1.CacheKey.manager.Analytics.BookingBase(adminID), _Analytic);
                            this.objUserResponse = (0, common_1.GetUserSuccessObj)(_Analytic, common_1.HttpStatusCodes.OK);
                        })
                            .catch((err) => {
                            this.objUserResponse = (0, common_1.GetUserErrorObj)(checkUser.error, common_1.HttpStatusCodes.BAD_REQUEST);
                        });
                    }
                }
                else {
                    this.objUserResponse = (0, common_1.GetUserErrorObj)(checkUser.error, common_1.HttpStatusCodes.NOT_ACCEPTABLE);
                }
            }
            catch (error) {
                this.objUserResponse = (0, common_1.GetUserErrorObj)(error.message, common_1.HttpStatusCodes.BAD_REQUEST);
            }
            finally {
                return this.objUserResponse;
            }
        });
        this.GetPropertyProfitByMonth = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const { adminID: adminID, year: year } = this.objParam.data;
                const checkUser = yield (0, AdiminVerification_1.checkAdminVerification)(adminID);
                if (checkUser.error === '') {
                    this.adminID = adminID;
                    const GetCacheData = common_1.Cache.getCacheData(Constant_1.CacheKey.manager.Analytics.PropertyProfitByMonth(adminID, year));
                    if (GetCacheData.error === '') {
                        this.objUserResponse = (0, common_1.GetUserSuccessObj)(GetCacheData.data, common_1.HttpStatusCodes.OK);
                    }
                    else {
                        const res = yield BookingModel_1.Booking.aggregate([
                            {
                                $match: {
                                    adminID: adminID,
                                    $expr: {
                                        $eq: [
                                            {
                                                $year: {
                                                    $dateFromString: {
                                                        dateString: '$BookingDate',
                                                        format: '%d/%m/%Y',
                                                    },
                                                },
                                            },
                                            year,
                                        ],
                                    },
                                },
                            },
                            {
                                $addFields: {
                                    parsedBookingDate: {
                                        $dateFromString: {
                                            dateString: '$BookingDate',
                                            format: '%d/%m/%Y',
                                        },
                                    },
                                },
                            },
                            {
                                $group: {
                                    _id: {
                                        propertyID: '$propertyID',
                                        month: { $month: '$parsedBookingDate' },
                                        year: { $year: '$parsedBookingDate' },
                                    },
                                    totalPay: { $sum: '$totalPay' },
                                    currency: { $first: '$currency' },
                                },
                            },
                            {
                                $sort: { '_id.propertyID': 1, '_id.year': 1, '_id.month': 1 },
                            },
                            {
                                $group: {
                                    _id: '$_id.propertyID',
                                    propertyID: { $first: '$_id.propertyID' },
                                    months: {
                                        $push: {
                                            month: '$_id.month',
                                            year: '$_id.year',
                                            totalPay: '$totalPay',
                                            monthName: {
                                                $arrayElemAt: [
                                                    [
                                                        'January',
                                                        'February',
                                                        'March',
                                                        'April',
                                                        'May',
                                                        'June',
                                                        'July',
                                                        'August',
                                                        'September',
                                                        'October',
                                                        'November',
                                                        'December',
                                                    ],
                                                    { $subtract: ['$_id.month', 1] },
                                                ],
                                            },
                                            currency: '$currency',
                                        },
                                    },
                                },
                            },
                            {
                                $addFields: {
                                    ID: { $toObjectId: '$propertyID' },
                                },
                            },
                            {
                                $lookup: {
                                    from: 'properties',
                                    localField: 'ID',
                                    foreignField: '_id',
                                    as: 'property',
                                },
                            },
                            {
                                $unwind: {
                                    path: '$property',
                                    preserveNullAndEmptyArrays: true,
                                },
                            },
                            {
                                $project: {
                                    _id: 0,
                                    propertyID: 1,
                                    months: 1,
                                    propertyName: '$property.name',
                                    profitChanges: {
                                        $cond: {
                                            if: { $eq: [{ $size: '$months' }, 1] },
                                            then: [{ profitChange: 100, status: 'Increase' }],
                                            else: {
                                                $map: {
                                                    input: { $range: [1, { $size: '$months' }] },
                                                    as: 'index',
                                                    in: {
                                                        $let: {
                                                            vars: {
                                                                currentMonth: { $arrayElemAt: ['$months', '$$index'] },
                                                                previousMonth: {
                                                                    $arrayElemAt: ['$months', { $subtract: ['$$index', 1] }],
                                                                },
                                                            },
                                                            in: {
                                                                profitChange: {
                                                                    $cond: [
                                                                        { $eq: ['$$previousMonth.totalPay', 0] },
                                                                        null,
                                                                        {
                                                                            $multiply: [
                                                                                {
                                                                                    $divide: [
                                                                                        {
                                                                                            $subtract: ['$$currentMonth.totalPay', '$$previousMonth.totalPay'],
                                                                                        },
                                                                                        '$$previousMonth.totalPay',
                                                                                    ],
                                                                                },
                                                                                100,
                                                                            ],
                                                                        },
                                                                    ],
                                                                },
                                                                status: {
                                                                    $cond: [
                                                                        {
                                                                            $gt: ['$$currentMonth.totalPay', '$$previousMonth.totalPay'],
                                                                        }, // Increase
                                                                        'Increase',
                                                                        {
                                                                            $cond: [
                                                                                {
                                                                                    $lt: ['$$currentMonth.totalPay', '$$previousMonth.totalPay'],
                                                                                }, // Decrease
                                                                                'Decrease',
                                                                                'Neutral', // No change
                                                                            ],
                                                                        },
                                                                    ],
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        ]);
                        common_1.Cache.SetCache(Constant_1.CacheKey.manager.Analytics.PropertyProfitByMonth(adminID, year), res);
                        this.objUserResponse = (0, common_1.GetUserSuccessObj)(res, common_1.HttpStatusCodes.OK);
                    }
                }
                else {
                    this.objUserResponse = (0, common_1.GetUserErrorObj)(checkUser.error, common_1.HttpStatusCodes.NOT_ACCEPTABLE);
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
