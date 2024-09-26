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
exports.PropertyFunction = void 0;
const common_1 = require("../common");
const Type_1 = require("../types/Type");
const Constant_1 = require("../Constant");
const PropertyModel_1 = require("../models/PropertyModel");
// import { User, UserClass, enumUserRole } from '';
const AdiminVerification_1 = require("../middleware/AdiminVerification");
const RoomModel_1 = require("../models/RoomModel");
const mongoose_1 = __importDefault(require("mongoose"));
const BookingModel_1 = require("../models/BookingModel");
const _AddProperty = Constant_1.Param.function.manager.Property.AddProperty;
const _GetSingleProperty = Constant_1.Param.function.manager.Property.GetSingleProperty;
const _GetAllProperty = Constant_1.Param.function.manager.Property.GetAllProperty;
const _UpdateProperty = Constant_1.Param.function.manager.Property.UpdateProperty;
const _DeleteProperty = Constant_1.Param.function.manager.Property.DeleteProperty;
// Guest--
const _GetAllPropertiesByCountry = Constant_1.Param.function.guest.property.GetAllPropertyByCountry;
const _GetHomePagePropertyData = Constant_1.Param.function.guest.property.GetHomePagePropertyData;
const _GetPropertyListByFilterSearch = Constant_1.Param.function.guest.property.GetPropertyListByFilterSearch;
const _GetGuestSinglePropertDetail = Constant_1.Param.function.guest.property.GetSinglePropertyDetail;
class PropertyFunction {
}
exports.PropertyFunction = PropertyFunction;
_a = PropertyFunction;
PropertyFunction.objUserResponse = new common_1.UserResponse();
PropertyFunction.findFunction = (objParam, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let _Function = new Functions();
    _Function.req = req;
    _Function.res = res;
    _Function.next = next;
    _Function.objParam = objParam;
    switch (objParam.function) {
        case _AddProperty:
            _a.objUserResponse = yield _Function.addNewProperty();
            break;
        case _GetSingleProperty:
            _a.objUserResponse = yield _Function.getSingleProperty();
            break;
        case _GetAllProperty:
            _a.objUserResponse = yield _Function.getAllProperty();
            break;
        case _UpdateProperty:
            _a.objUserResponse = yield _Function.updateProperty();
            break;
        case _DeleteProperty:
            _a.objUserResponse = yield _Function.deleteProperty();
            break;
        case _GetAllPropertiesByCountry:
            _a.objUserResponse = yield _Function.getAllPropertyByCountry();
            break;
        case _GetPropertyListByFilterSearch:
            _a.objUserResponse = yield _Function.GetPropertyListByFilterSearch();
            break;
        case _GetGuestSinglePropertDetail:
            _a.objUserResponse = yield _Function.GetSinglePropertyDetail();
            break;
        case _GetHomePagePropertyData:
            _a.objUserResponse = yield _Function.GetGuestHomePagePropertyData();
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
        this.addNewProperty = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const { address, adminID, amenities, city, country, createdAt, description, email, images, name, phone, propertyType, rooms, state, website, zipCode, updatedAt, jobHiring, checkInTime, checkOutTime, } = this.objParam.data;
                const checkUser = yield (0, AdiminVerification_1.checkAdminVerification)(adminID);
                const ManagerPropertyCache = common_1.Cache.getCacheData(Constant_1.CacheKey.manager.property(checkUser.data.email));
                if (checkUser.error === '') {
                    if (email === checkUser.data.email) {
                        this.objUserResponse = (0, common_1.GetUserErrorObj)('You cannot use your register email as public email.', common_1.HttpStatusCodes.NOT_ACCEPTABLE);
                    }
                    else {
                        const _Property = yield PropertyModel_1.Property.create({
                            address: address,
                            adminID: adminID,
                            amenities: amenities,
                            city: city,
                            country: country,
                            createdAt: createdAt,
                            description: description,
                            email: email,
                            images: images,
                            name: name,
                            phone: phone,
                            propertyType: propertyType,
                            rooms: rooms,
                            state: state,
                            website: website,
                            zipCode: zipCode,
                            updatedAt: updatedAt,
                            jobHiring: jobHiring,
                            checkInTime: checkInTime,
                            checkOutTime: checkOutTime,
                        });
                        // const insert = await PropertyModel.insertMany(dummy)
                        const isSave = yield _Property.save();
                        if (isSave) {
                            this.objUserResponse = (0, common_1.GetUserSuccessObj)(`Success: New ` + propertyType + ` has been created.`, common_1.HttpStatusCodes.CREATED);
                            if (ManagerPropertyCache.data !== '') {
                                common_1.Cache.ClearCache(Constant_1.CacheKey.manager.property(checkUser.data.email));
                            }
                        }
                        else {
                            this.objUserResponse = (0, common_1.GetUserErrorObj)(`Server error not able to save ` + propertyType + `. Create Manager account first.`, common_1.HttpStatusCodes.BAD_REQUEST);
                        }
                    }
                }
                else {
                    this.objUserResponse = (0, common_1.GetUserErrorObj)(checkUser.error, common_1.HttpStatusCodes.NOT_ACCEPTABLE);
                }
            }
            catch (error) {
                this.objUserResponse = (0, common_1.GetUserErrorObj)(error.message, common_1.HttpStatusCodes.BAD_GATEWAY);
            }
            finally {
                return this.objUserResponse;
            }
        });
        this.getSingleProperty = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const { adminID, propertyID } = this.objParam.data;
                const checkUser = yield (0, AdiminVerification_1.checkAdminVerification)(adminID);
                if (checkUser.error === '') {
                    const isProperty = yield PropertyModel_1.Property.findOne({
                        $and: [{ _id: propertyID }, { adminID: adminID }],
                    })
                        .populate({
                        path: 'rooms',
                        populate: {
                            path: 'property',
                        },
                    })
                        .exec();
                    if (isProperty) {
                        this.objUserResponse = (0, common_1.GetUserSuccessObj)(isProperty, common_1.HttpStatusCodes.OK);
                    }
                    else {
                        this.objUserResponse = (0, common_1.GetUserErrorObj)(`Server error: Property id is not matching with admin, or wronge propertyID / admin  is provided`, common_1.HttpStatusCodes.NOT_ACCEPTABLE);
                    }
                }
                else {
                    this.objUserResponse = (0, common_1.GetUserErrorObj)(checkUser.error, common_1.HttpStatusCodes.NOT_ACCEPTABLE);
                }
            }
            catch (error) {
                this.objUserResponse = (0, common_1.GetUserErrorObj)(error.message, common_1.HttpStatusCodes.BAD_GATEWAY);
            }
            finally {
                return this.objUserResponse;
            }
        });
        this.getAllProperty = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = this.objParam.data;
                const checkUser = yield (0, AdiminVerification_1.checkAdminVerification)(id);
                if (checkUser.error === '') {
                    const ManagerPropertyCache = common_1.Cache.getCacheData(Constant_1.CacheKey.manager.property(checkUser.data.email));
                    if (ManagerPropertyCache.error === '') {
                        this.objUserResponse = (0, common_1.GetUserSuccessObj)(ManagerPropertyCache.data, common_1.HttpStatusCodes.OK);
                    }
                    else {
                        // const allProperties: PropertyClass[] = await PropertyModel.find({ adminID: checkUser.data._id })
                        const allProperties = yield PropertyModel_1.Property.find({ adminID: id }).populate({
                            path: 'rooms',
                            populate: {
                                path: 'property',
                            },
                        });
                        if (allProperties) {
                            common_1.Cache.SetCache(Constant_1.CacheKey.manager.property(checkUser.data.email), allProperties);
                            this.objUserResponse = (0, common_1.GetUserSuccessObj)(allProperties, common_1.HttpStatusCodes.OK);
                        }
                    }
                }
                else {
                    this.objUserResponse = (0, common_1.GetUserErrorObj)(checkUser.error, common_1.HttpStatusCodes.NOT_ACCEPTABLE);
                }
            }
            catch (error) {
                this.objUserResponse = (0, common_1.GetUserErrorObj)(error.message, common_1.HttpStatusCodes.BAD_GATEWAY);
            }
            finally {
                return this.objUserResponse;
            }
        });
        this.updateProperty = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id, address, adminID, amenities, city, country, createdAt, description, email, images, name, phone, propertyType, rooms, state, website, zipCode, updatedAt, jobHiring, checkInTime, checkOutTime, } = this.objParam.data;
                const checkUser = yield (0, AdiminVerification_1.checkAdminVerification)(adminID);
                if (checkUser.error === '') {
                    if (email === checkUser.data.email) {
                        this.objUserResponse = (0, common_1.GetUserErrorObj)('You cannot use your register email as public email.', common_1.HttpStatusCodes.NOT_ACCEPTABLE);
                    }
                    else {
                        const ManagerPropertyCache = common_1.Cache.getCacheData(Constant_1.CacheKey.manager.property(checkUser.data.email));
                        const UserPropertyCache = common_1.Cache.getCacheData(Constant_1.CacheKey.user.property(_id));
                        const ManagerRoomCache = common_1.Cache.getCacheData(Constant_1.CacheKey.manager.room(checkUser.data.email));
                        const isUpdated = yield PropertyModel_1.Property.findOneAndUpdate({
                            $and: [{ _id: _id }, { adminID: adminID }],
                        }, {
                            $set: {
                                address: address,
                                amenities: amenities,
                                city: city,
                                country: country,
                                description: description,
                                email: email,
                                images: images,
                                name: name,
                                phone: phone,
                                propertyType: propertyType,
                                state: state,
                                website: website,
                                zipCode: zipCode,
                                updatedAt: updatedAt,
                                jobHiring: jobHiring,
                                checkInTime: checkInTime,
                                checkOutTime: checkOutTime,
                            },
                        }, { new: true });
                        if (isUpdated) {
                            if (ManagerPropertyCache.data !== '') {
                                common_1.Cache.ClearCache(Constant_1.CacheKey.manager.property(checkUser.data.email));
                            }
                            if (UserPropertyCache.data !== '') {
                                common_1.Cache.ClearCache(Constant_1.CacheKey.user.property(_id));
                            }
                            if (ManagerRoomCache.data !== '') {
                                common_1.Cache.ClearCache(Constant_1.CacheKey.manager.room(checkUser.data.email));
                            }
                            this.objUserResponse = (0, common_1.GetUserSuccessObj)(`Success: Your ` + propertyType + ` has been Updated.`, common_1.HttpStatusCodes.CREATED);
                        }
                        else {
                            this.objUserResponse = (0, common_1.GetUserErrorObj)(`Server error not able to Update ` + propertyType + `. Create Manager account first. Might wrong credentials.`, common_1.HttpStatusCodes.BAD_REQUEST);
                        }
                    }
                }
                else {
                    this.objUserResponse = (0, common_1.GetUserErrorObj)(checkUser.error, common_1.HttpStatusCodes.NOT_ACCEPTABLE);
                }
            }
            catch (error) {
                this.objUserResponse = (0, common_1.GetUserErrorObj)(error.message, common_1.HttpStatusCodes.BAD_GATEWAY);
            }
            finally {
                return this.objUserResponse;
            }
        });
        this.deleteProperty = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const { adminID, PropertyID } = this.objParam.data;
                const checkUser = yield (0, AdiminVerification_1.checkAdminVerification)(adminID);
                if (checkUser.error === '') {
                    const ManagerPropertyCache = common_1.Cache.getCacheData(Constant_1.CacheKey.manager.property(checkUser.data.email));
                    const UserPropertyCache = common_1.Cache.getCacheData(Constant_1.CacheKey.user.property(PropertyID));
                    const ManagerRoomCache = common_1.Cache.getCacheData(Constant_1.CacheKey.manager.room(checkUser.data.email));
                    const isDeleted = yield PropertyModel_1.Property.findOneAndDelete({
                        $and: [
                            {
                                _id: PropertyID,
                            },
                            {
                                adminID: adminID,
                            },
                        ],
                    });
                    if ((isDeleted === null || isDeleted === void 0 ? void 0 : isDeleted.rooms.length) > 0) {
                        const isRoomDelete = yield RoomModel_1.Room.deleteMany({ _id: { $in: isDeleted === null || isDeleted === void 0 ? void 0 : isDeleted.rooms } });
                        if (isRoomDelete) {
                            if (ManagerPropertyCache.data !== '') {
                                common_1.Cache.ClearCache(Constant_1.CacheKey.manager.property(checkUser.data.email));
                            }
                            if (UserPropertyCache.data !== '') {
                                common_1.Cache.ClearCache(Constant_1.CacheKey.user.property(PropertyID));
                            }
                            if (ManagerRoomCache.data !== '') {
                                common_1.Cache.ClearCache(Constant_1.CacheKey.manager.room(checkUser.data.email));
                            }
                            const UserRoomCache = common_1.Cache.getCacheData(Constant_1.CacheKey.user.room(isDeleted === null || isDeleted === void 0 ? void 0 : isDeleted._id));
                            if (UserRoomCache.data !== '') {
                                common_1.Cache.ClearCache(Constant_1.CacheKey.user.room(isDeleted === null || isDeleted === void 0 ? void 0 : isDeleted._id));
                            }
                            this.objUserResponse = (0, common_1.GetUserSuccessObj)(`Success: Your ` + isDeleted.propertyType + isDeleted.name + ` has been Deleted.`, common_1.HttpStatusCodes.OK);
                        }
                        else {
                            this.objUserResponse = (0, common_1.GetUserErrorObj)(`Server error not able to Delete Rooms of ` +
                                isDeleted.propertyType +
                                isDeleted.name +
                                `. Create Manager account first. Might wrong credentials.`, common_1.HttpStatusCodes.BAD_REQUEST);
                        }
                    }
                    else {
                        if (isDeleted) {
                            if (ManagerPropertyCache.data !== '') {
                                common_1.Cache.ClearCache(Constant_1.CacheKey.manager.property(checkUser.data.email));
                            }
                            if (UserPropertyCache.data !== '') {
                                common_1.Cache.ClearCache(Constant_1.CacheKey.user.property(PropertyID));
                            }
                            this.objUserResponse = (0, common_1.GetUserSuccessObj)(`Success: Your ` + isDeleted.propertyType + isDeleted.name + ` has been Deleted.`, common_1.HttpStatusCodes.OK);
                        }
                        else {
                            this.objUserResponse = (0, common_1.GetUserErrorObj)(`Server error not able to Delete ` +
                                isDeleted.propertyType +
                                isDeleted.name +
                                `. Create Manager account first. Might wrong credentials.`, common_1.HttpStatusCodes.BAD_REQUEST);
                        }
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
        // ---------------------- Guest ------------------------
        this.getAllPropertyByCountry = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const { country } = this.objParam.data;
                const Properties = yield PropertyModel_1.Property.find({ country: country }).populate({
                    path: 'rooms',
                    populate: {
                        path: 'property',
                    },
                });
                this.objUserResponse = (0, common_1.GetUserSuccessObj)(Properties, common_1.HttpStatusCodes.OK);
            }
            catch (error) {
                this.objUserResponse = (0, common_1.GetUserErrorObj)(error.message, common_1.HttpStatusCodes.BAD_GATEWAY);
            }
            finally {
                return this.objUserResponse;
            }
        });
        this.GetPropertyListByFilterSearch = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const { FilterData } = this.objParam.data;
                const limit = 5;
                const skip = (Number(FilterData.page) - 1) * limit;
                const Properties = yield PropertyModel_1.Property.aggregate([
                    {
                        $match: {
                            $and: getPropertyFilterAndCondition(FilterData),
                        },
                    },
                    {
                        $lookup: {
                            from: 'reviews',
                            localField: 'reviews',
                            foreignField: '_id',
                            as: 'review',
                        },
                    },
                    {
                        $lookup: {
                            from: 'rooms',
                            localField: 'rooms',
                            foreignField: '_id',
                            as: 'roomDetails',
                        },
                    },
                    {
                        $unwind: {
                            path: '$review',
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $addFields: {
                            avgRating: {
                                $avg: {
                                    $map: {
                                        input: '$review.reviewInfo',
                                        as: 'review',
                                        in: '$$review.rating',
                                    },
                                },
                            },
                            maxPrice: {
                                $max: {
                                    $map: {
                                        input: '$roomDetails',
                                        as: 'roomDetails',
                                        in: '$$roomDetails.price',
                                    },
                                },
                            },
                            totalReviews: {
                                $size: {
                                    $ifNull: ['$review.reviewInfo', []],
                                },
                            },
                            totalRooms: {
                                $size: {
                                    $ifNull: ['$roomDetails', []],
                                },
                            },
                        },
                    },
                    {
                        $unwind: {
                            path: '$roomDetails',
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $match: {
                            totalRooms: { $gte: 1 },
                        },
                    },
                    {
                        $group: {
                            _id: '$_id',
                            images: { $first: '$images' },
                            name: { $first: '$name' },
                            city: { $first: '$city' },
                            country: { $first: '$country' },
                            state: { $first: '$state' },
                            amenities: { $first: '$amenities' },
                            jobHiring: { $first: '$jobHiring' },
                            avgRating: { $first: '$avgRating' },
                            totalReviews: { $first: '$totalReviews' },
                            totalRooms: { $first: '$totalRooms' },
                            maxPrice: { $first: '$maxPrice' },
                            propertyType: { $first: '$propertyType' },
                            address: { $first: '$address' },
                            availableRooms: {
                                $sum: {
                                    $cond: [{ $eq: ['$roomDetails.isAvailable', true] }, 1, 0],
                                },
                            },
                            roomDetails: { $push: '$roomDetails' },
                        },
                    },
                    {
                        $addFields: {
                            currency: { $arrayElemAt: ['$roomDetails.currency', 0] },
                        },
                    },
                    {
                        $match: {
                            $and: [
                                {
                                    $expr: {
                                        $cond: {
                                            if: { $ne: [FilterData.Price, undefined] },
                                            then: { $lte: ['$maxPrice', getMaxPrice(FilterData)] },
                                            else: true,
                                        },
                                    },
                                },
                                {
                                    $expr: {
                                        $cond: {
                                            if: { $ne: [FilterData.reviewScore, null] },
                                            then: { $gte: ['$avgRating', Number(FilterData.reviewScore)] },
                                            else: true,
                                        },
                                    },
                                },
                                {
                                    $expr: {
                                        $cond: {
                                            if: { $ne: [FilterData.availableRooms, undefined] },
                                            then: { $gte: ['$availableRooms', Number(FilterData.availableRooms)] },
                                            else: true,
                                        },
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $facet: {
                            totalCount: [{ $count: 'count' }],
                            properties: [
                                { $skip: skip },
                                { $limit: limit },
                                {
                                    $project: {
                                        _id: 1,
                                        images: 1,
                                        name: 1,
                                        city: 1,
                                        country: 1,
                                        state: 1,
                                        amenities: 1,
                                        jobHiring: 1,
                                        avgRating: 1,
                                        totalReviews: 1,
                                        totalRooms: 1,
                                        maxPrice: 1,
                                        propertyType: 1,
                                        address: 1,
                                        availableRooms: 1,
                                        currency: 1,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $unwind: '$totalCount',
                    },
                    {
                        $addFields: {
                            totalProperties: '$totalCount.count',
                        },
                    },
                    {
                        $replaceRoot: {
                            newRoot: {
                                properties: '$properties',
                                totalProperties: '$totalProperties',
                            },
                        },
                    },
                ]);
                this.objUserResponse = (0, common_1.GetUserSuccessObj)(Properties, common_1.HttpStatusCodes.OK);
            }
            catch (error) {
                this.objUserResponse = (0, common_1.GetUserErrorObj)(error.message, common_1.HttpStatusCodes.BAD_GATEWAY);
            }
            finally {
                return this.objUserResponse;
            }
        });
        this.GetSinglePropertyDetail = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const { country, state, propertyName, propertyID } = this.objParam.data;
                const UserPropertyCache = common_1.Cache.getCacheData(Constant_1.CacheKey.user.property(propertyID));
                if (UserPropertyCache.error === '') {
                    this.objUserResponse = (0, common_1.GetUserSuccessObj)(UserPropertyCache.data, common_1.HttpStatusCodes.OK);
                }
                else {
                    const property = yield PropertyModel_1.Property.aggregate([
                        {
                            $match: {
                                $and: [
                                    {
                                        _id: new mongoose_1.default.Types.ObjectId(propertyID),
                                    },
                                    {
                                        country: country,
                                    },
                                    {
                                        state: state,
                                    },
                                    {
                                        name: propertyName.split('-').join(' '),
                                    },
                                ],
                            },
                        },
                        {
                            $lookup: {
                                from: 'rooms',
                                localField: 'rooms',
                                foreignField: '_id',
                                as: 'rooms',
                            },
                        },
                        {
                            $lookup: {
                                from: 'reviews',
                                localField: 'reviews',
                                foreignField: '_id',
                                as: 'review',
                            },
                        },
                        {
                            $lookup: {
                                from: 'subscribers',
                                localField: '_id',
                                foreignField: 'property',
                                as: 'subscribersData',
                            },
                        },
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'subscribersData.subscribers',
                                foreignField: '_id',
                                pipeline: [{ $project: { _id: 0, email: 1 } }],
                                as: 'subscribers',
                            },
                        },
                        {
                            $addFields: {
                                avgReview: {
                                    $avg: {
                                        $map: {
                                            input: { $ifNull: [{ $arrayElemAt: ['$review.reviewInfo', 0] }, []] },
                                            as: 'review',
                                            in: '$$review.rating',
                                        },
                                    },
                                },
                                review: { $arrayElemAt: ['$review', 0] },
                                subscribers: '$subscribers',
                            },
                        },
                        {
                            $unwind: '$rooms',
                        },
                        {
                            $group: {
                                _id: {
                                    propertyID: '$_id',
                                    roomType: '$rooms.type',
                                },
                                rooms: { $push: '$rooms' },
                                avgReview: { $first: '$avgReview' },
                                review: { $first: '$review' },
                                subscribers: { $first: '$subscribers' },
                                propertyDetails: {
                                    $first: {
                                        name: '$name',
                                        propertyType: '$propertyType',
                                        images: '$images',
                                        address: '$address',
                                        city: '$city',
                                        state: '$state',
                                        country: '$country',
                                        zipCode: '$zipCode',
                                        phone: '$phone',
                                        email: '$email',
                                        website: '$website',
                                        description: '$description',
                                        amenities: '$amenities',
                                        adminID: '$adminID',
                                        checkInTime: '$checkInTime',
                                        checkOutTime: '$checkOutTime',
                                    },
                                },
                            },
                        },
                        {
                            $group: {
                                _id: '$_id.propertyID',
                                Rooms: {
                                    $push: {
                                        type: '$_id.roomType',
                                        roomInfo: '$rooms',
                                    },
                                },
                                avgReview: { $first: '$avgReview' },
                                review: { $first: '$review' },
                                subscribers: { $first: '$subscribers' },
                                propertyDetails: { $first: '$propertyDetails' },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                propertyID: '$_id',
                                avgReview: 1,
                                review: 1,
                                propertyDetails: 1,
                                Rooms: 1,
                                subscribers: 1,
                            },
                        },
                    ]);
                    if (property !== undefined) {
                        common_1.Cache.SetCache(Constant_1.CacheKey.user.property(propertyID), property[0]);
                        this.objUserResponse = (0, common_1.GetUserSuccessObj)(property[0], common_1.HttpStatusCodes.OK);
                    }
                    else {
                        this.objUserResponse = (0, common_1.GetUserErrorObj)('The property you are looking for is not available might wron url. Please try for another property', common_1.HttpStatusCodes.NOT_FOUND);
                    }
                }
            }
            catch (error) {
                this.objUserResponse = (0, common_1.GetUserErrorObj)(error.message, common_1.HttpStatusCodes.BAD_GATEWAY);
            }
            finally {
                return this.objUserResponse;
            }
        });
        this.GetGuestHomePagePropertyData = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const { country } = this.objParam.data;
                yield Promise.all([this.GetTrendingProperties(country), this.getTotalPropertyByState(country), this.getTotalPropertyByPropertType(country)]).then((res) => {
                    const objHomeData = new Type_1.THomePageData();
                    objHomeData.TrendingDestinations = res[0];
                    objHomeData.TotalPropertByCountryState = res[1];
                    objHomeData.TotalPropertByPropertyType = res[2];
                    this.objUserResponse = (0, common_1.GetUserSuccessObj)(objHomeData, common_1.HttpStatusCodes.OK);
                }).catch((err) => {
                    this.objUserResponse = (0, common_1.GetUserErrorObj)(err, common_1.HttpStatusCodes.BAD_GATEWAY);
                });
            }
            catch (error) {
                this.objUserResponse = (0, common_1.GetUserErrorObj)(error.message, common_1.HttpStatusCodes.BAD_GATEWAY);
            }
            finally {
                return this.objUserResponse;
            }
        });
        this.getTotalPropertyByState = (country) => __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const propertiesByState = yield PropertyModel_1.Property.aggregate([
                            {
                                $match: {
                                    country: country,
                                },
                            },
                            {
                                $group: {
                                    _id: '$state',
                                    totalProperties: { $sum: 1 },
                                },
                            },
                            {
                                $project: {
                                    _id: 0,
                                    state: '$_id',
                                    totalProperties: 1,
                                },
                            },
                            {
                                $sort: {
                                    state: 1,
                                },
                            },
                        ]);
                        resolve(propertiesByState);
                    }
                    catch (error) {
                        reject(error.message);
                    }
                }));
                return res;
            }
            catch (error) {
                return [];
            }
        });
        this.getTotalPropertyByPropertType = (country) => __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const propertiesByState = yield PropertyModel_1.Property.aggregate([
                            {
                                $match: {
                                    country: country,
                                },
                            },
                            {
                                $group: {
                                    _id: '$propertyType',
                                    totalProperties: { $sum: 1 },
                                },
                            },
                            {
                                $project: {
                                    _id: 0,
                                    propertyType: '$_id',
                                    totalProperties: 1,
                                },
                            },
                            {
                                $sort: {
                                    propertyType: 1,
                                },
                            },
                        ]);
                        resolve(propertiesByState);
                    }
                    catch (error) {
                        reject(error.message);
                    }
                }));
                return res;
            }
            catch (error) {
                return [];
            }
        });
        this.GetTrendingProperties = (country) => __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const propertyList = yield BookingModel_1.Booking.aggregate([
                            {
                                $group: {
                                    _id: '$propertyID',
                                    propertyID: { $first: { $toObjectId: '$propertyID' } },
                                    count: { $sum: 1 },
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
                                    'property.country': country,
                                },
                            },
                            {
                                $replaceRoot: {
                                    newRoot: '$property',
                                },
                            },
                        ]);
                        resolve(propertyList);
                    }
                    catch (error) {
                        reject(error.message);
                    }
                }));
                return res;
            }
            catch (error) {
                return [];
            }
        });
    }
}
const getPropertyFilterAndCondition = (FilterData) => {
    const { Price, state, city, propertyType, page, country } = FilterData;
    let and = [];
    and.push({
        country: country,
    });
    and.push({
        state: state,
    });
    if (city !== null && city !== undefined) {
        and.push({
            city: {
                $in: city.split(','),
            },
        });
    }
    if (propertyType !== null && propertyType !== undefined) {
        and.push({
            propertyType: {
                $in: propertyType.split(','),
            },
        });
    }
    return and;
};
const getMaxPrice = (FilterData) => {
    const { Price } = FilterData;
    let maxPrice = 1000000000000;
    if (Price !== null && Price !== undefined) {
        if (typeof Price === 'string') {
            const numPrice = Number(Price);
            if (numPrice >= 1000) {
                maxPrice = numPrice;
            }
        }
    }
    return maxPrice;
};
