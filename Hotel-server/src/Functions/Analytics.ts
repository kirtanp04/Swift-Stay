import { NextFunction, Request, Response } from 'express';
import { Cache, GetUserErrorObj, GetUserSuccessObj, HttpStatusCodes, UserResponse } from '../common';
import { CacheKey, Param } from '../Constant';
import { checkAdminVerification } from '../middleware/AdiminVerification';
import {
    Analytic,
    TAllPropertyWithAvgReview,
    TBookingAnalytics,
    TParam,
    TRevenueAnalytics,
    TToppropertyByBooking,
    TTotalpropertyAndRoom,
} from '../types/Type';
import { Booking, enumBookingStatus } from '../models/BookingModel';
import { Property } from '../models/PropertyModel';
import { Review } from '../models/Review';

// Admin
const _ManagerGetOverviewMetrics = Param.function.manager.analytics.GetOverviewMetrics;
const _ManagerPropertyByStates = Param.function.manager.analytics.PropertybyStates;
const _ManagerGetPropertyProfitByMonth = Param.function.manager.analytics.GetPropertyProfitByMonth;

export class AnalyticFunction {
    private static objUserResponse: UserResponse = new UserResponse();

    static findFunction = async (objParam: TParam, req: Request, res: Response, next: NextFunction): Promise<UserResponse> => {
        let _Function = new Functions();
        _Function.req = req;
        _Function.res = res;
        _Function.next = next;
        _Function.objParam = objParam;

        switch (objParam.function) {
            case _ManagerGetOverviewMetrics:
                this.objUserResponse = await _Function.GetOverviewMetrics();
                break;

            case _ManagerPropertyByStates:
                this.objUserResponse = await _Function.getPropertyByState();
                break;

            case _ManagerGetPropertyProfitByMonth:
                this.objUserResponse = await _Function.GetPropertyProfitByMonth();
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

    private adminID: string | null = null;

    public req: Request | null = null;

    public res: Response | null = null;

    public next: NextFunction | null = null;

    public objParam: TParam = new TParam();

    // Overview Matrics

    // row 1
    private getTotalBooking = async (): Promise<number> => {
        if (this.adminID === null) return 0;

        const TotalBookings: number = await new Promise(async (resolve, reject) => {
            try {
                const TotalBookingCount = await Booking.aggregate([
                    {
                        $match: {
                            bookingStatus: enumBookingStatus.booked,
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
            } catch (error: any) {
                reject(error.message);
            }
        });

        return TotalBookings;
    };

    private getTotalRevenue = async (): Promise<string> => {
        if (this.adminID === null) return '';

        const TotalRevenue: string = await new Promise(async (resolve, reject) => {
            try {
                const TotalRevenueGenerated = await Booking.aggregate([
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
            } catch (error: any) {
                reject(error.message);
            }
        });

        return TotalRevenue;
    };

    private getTotalPropertyAndRoom = async (): Promise<TTotalpropertyAndRoom> => {
        if (this.adminID === null) return { property: 0, room: 0 };

        const TotalPropertyAndRoom: TTotalpropertyAndRoom = await new Promise(async (resolve, reject) => {
            try {
                const Totalcount = await Property.aggregate([
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
            } catch (error: any) {
                reject(error.message);
            }
        });

        return TotalPropertyAndRoom;
    };

    //row 2
    private IncreaseInRevenue = async (): Promise<TRevenueAnalytics[]> => {
        if (this.adminID === null) return [];

        const IncreaseRevenue: TRevenueAnalytics[] = await new Promise(async (resolve, reject) => {
            try {
                const IncreasedRevenue = await Booking.aggregate([
                    {
                        $match: {
                            bookingStatus: enumBookingStatus.booked,
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
            } catch (error: any) {
                reject(error.message);
            }
        });
        return IncreaseRevenue;
    };

    private IncreaseInBooking = async (): Promise<TBookingAnalytics[]> => {
        if (this.adminID === null) return [];

        const IncreaseRevenue: TBookingAnalytics[] = await new Promise(async (resolve, reject) => {
            try {
                const IncreasedBooking = await Booking.aggregate([
                    {
                        $match: {
                            bookingStatus: enumBookingStatus.booked,
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
            } catch (error: any) {
                reject(error.message);
            }
        });
        return IncreaseRevenue;
    };

    //row 3
    private getTopPropertyByBooking = async (): Promise<TToppropertyByBooking[]> => {
        if (this.adminID === null) return [];
        const TotalProperties = await new Promise<TToppropertyByBooking[]>(async (resolve, reject) => {
            try {
                const Data = await Booking.aggregate([
                    {
                        $match: {
                            bookingStatus: enumBookingStatus.booked,
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
            } catch (error: any) {
                reject(error.message);
            }
        });

        return TotalProperties;
    };

    private getAverageReviewsWithProperty = async (): Promise<TAllPropertyWithAvgReview[]> => {
        if (this.adminID === null) return [];

        const propertyWithAvgReview = await new Promise<TAllPropertyWithAvgReview[]>(async (resolve, reject) => {
            try {
                const res = await Review.aggregate([
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
            } catch (error: any) {
                reject(error.message);
            }
        });

        return propertyWithAvgReview;
    };

    public getPropertyByState = async (): Promise<UserResponse> => {
        try {
            const { adminID, country } = this.objParam.data;

            const checkUser = await checkAdminVerification(adminID);

            if (checkUser.error === '') {
                const propertyByStates = await Property.aggregate([
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

                this.objUserResponse = GetUserSuccessObj(propertyByStates, HttpStatusCodes.OK);
            } else {
                this.objUserResponse = GetUserErrorObj(checkUser.error, HttpStatusCodes.NOT_ACCEPTABLE);
            }
        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_REQUEST);
        } finally {
            return this.objUserResponse;
        }
    };

    public GetOverviewMetrics = async (): Promise<UserResponse> => {
        try {
            const adminID = this.objParam.data;

            const checkUser = await checkAdminVerification(adminID);
            if (checkUser.error === '') {
                this.adminID = adminID;

                const GetCacheData = Cache.getCacheData(CacheKey.manager.Analytics.BookingBase(adminID));

                if (GetCacheData.error === '') {
                    this.objUserResponse = GetUserSuccessObj(GetCacheData.data, HttpStatusCodes.OK);
                } else {
                    await Promise.all([
                        this.getTotalBooking(),
                        this.getTotalRevenue(),
                        this.getTotalPropertyAndRoom(),
                        this.IncreaseInRevenue(),
                        this.IncreaseInBooking(),
                        this.getTopPropertyByBooking(),
                        this.getAverageReviewsWithProperty(),
                    ])
                        .then((res) => {
                            const _Analytic = new Analytic();
                            _Analytic.TotalBookings = res[0];
                            _Analytic.TotalRevenue = res[1];
                            _Analytic.TotalPropertyandRooms = res[2];
                            _Analytic.RevenueAnalytics = res[3];
                            _Analytic.BookingAnalytics = res[4];
                            _Analytic.TopPropertiesByBooking = res[5];
                            _Analytic.AllPropertyWithAvgReview = res[6];

                            Cache.SetCache(CacheKey.manager.Analytics.BookingBase(adminID), _Analytic);
                            this.objUserResponse = GetUserSuccessObj(_Analytic, HttpStatusCodes.OK);
                        })
                        .catch((err) => {
                            this.objUserResponse = GetUserErrorObj(checkUser.error, HttpStatusCodes.BAD_REQUEST);
                        });
                }
            } else {
                this.objUserResponse = GetUserErrorObj(checkUser.error, HttpStatusCodes.NOT_ACCEPTABLE);
            }
        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_REQUEST);
        } finally {
            return this.objUserResponse;
        }
    };
    public GetPropertyProfitByMonth = async (): Promise<UserResponse> => {
        try {
            const { adminID: adminID, year: year } = this.objParam.data;

            const checkUser = await checkAdminVerification(adminID);
            if (checkUser.error === '') {
                this.adminID = adminID;

                const GetCacheData = Cache.getCacheData(CacheKey.manager.Analytics.PropertyProfitByMonth(adminID, year));

                if (GetCacheData.error === '') {
                    this.objUserResponse = GetUserSuccessObj(GetCacheData.data, HttpStatusCodes.OK);
                } else {
                    const res = await Booking.aggregate([
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

                    Cache.SetCache(CacheKey.manager.Analytics.PropertyProfitByMonth(adminID, year), res);
                    this.objUserResponse = GetUserSuccessObj(res, HttpStatusCodes.OK);
                }
            } else {
                this.objUserResponse = GetUserErrorObj(checkUser.error, HttpStatusCodes.NOT_ACCEPTABLE);
            }
        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_REQUEST);
        } finally {
            return this.objUserResponse;
        }
    };
}
