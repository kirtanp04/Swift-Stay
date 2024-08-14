import { NextFunction, Request, Response } from 'express';
import { Cache, Crypt, GetUserErrorObj, GetUserSuccessObj, HttpStatusCodes, UserResponse } from '../common';
import { TParam } from '../types/Type';
import { Param, CacheKey } from '../Constant';
import { Property as PropertyModel, PropertyClass, enumPropertyType } from '../models/PropertyModel';
// import { User, UserClass, enumUserRole } from '';
import { checkAdminVerification } from '../middleware/AdiminVerification';
import { Room } from '../models/RoomModel';
import mongoose, { FilterQuery } from 'mongoose';

const _AddProperty = Param.function.manager.Property.AddProperty;
const _GetSingleProperty = Param.function.manager.Property.GetSingleProperty;
const _GetAllProperty = Param.function.manager.Property.GetAllProperty;
const _UpdateProperty = Param.function.manager.Property.UpdateProperty;
const _DeleteProperty = Param.function.manager.Property.DeleteProperty;

// Guest--
const _GetAllPropertyByState = Param.function.guest.property.GetAllPropertyByState;
const _GetAllPropertiesByCountry = Param.function.guest.property.GetAllPropertyByCountry;
const _GetTotalPropertByCountry = Param.function.guest.property.GetTotalPropertByCountry;
const _GetTotalPropertyByType = Param.function.guest.property.GetTotalPropertyByType;
const _GetPropertyListByFilterSearch = Param.function.guest.property.GetPropertyListByFilterSearch;
const _GetGuestSinglePropertDetail = Param.function.guest.property.GetSinglePropertyDetail;

export class PropertyFunction {
    private static objUserResponse: UserResponse = new UserResponse();

    static findFunction = async (objParam: TParam, req: Request, res: Response, next: NextFunction): Promise<UserResponse> => {
        let _Function = new Functions();
        _Function.req = req;
        _Function.res = res;
        _Function.next = next;
        _Function.objParam = objParam;

        if (objParam.function === _AddProperty) {
            const _res = await _Function.addNewProperty();
            this.objUserResponse = _res;
        } else if (objParam.function === _GetSingleProperty) {
            const _res = await _Function.getSingleProperty();
            this.objUserResponse = _res;
        } else if (objParam.function === _GetAllProperty) {
            const _res = await _Function.getAllProperty();
            this.objUserResponse = _res;
        } else if (objParam.function === _UpdateProperty) {
            const _res = await _Function.updateProperty();
            this.objUserResponse = _res;
        } else if (objParam.function === _DeleteProperty) {
            const _res = await _Function.deleteProperty();
            this.objUserResponse = _res;
        } else if (objParam.function === _GetAllPropertiesByCountry) {
            const _res = await _Function.getAllPropertyByCountry();
            this.objUserResponse = _res;
        } else if (objParam.function === _GetTotalPropertByCountry) {
            const _res = await _Function.getTotalPropertyByCountry();
            this.objUserResponse = _res;
        } else if (objParam.function === _GetTotalPropertyByType) {
            const _res = await _Function.getTotalPropertyByPropertType();
            this.objUserResponse = _res;
        } else if (objParam.function === _GetPropertyListByFilterSearch) {
            const _res = await _Function.GetPropertyListByFilterSearch();
            this.objUserResponse = _res;
        } else if (objParam.function === _GetGuestSinglePropertDetail) {
            const _res = await _Function.GetSinglePropertyDetail();
            this.objUserResponse = _res;
        } else {
            this.objUserResponse = GetUserErrorObj('Server error: Wronge Function.', HttpStatusCodes.BAD_REQUEST);
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

    public addNewProperty = async (): Promise<UserResponse> => {
        try {
            const {
                address,
                adminID,
                amenities,
                city,
                country,
                createdAt,
                description,
                email,
                images,
                name,
                phone,
                propertyType,
                rooms,
                state,
                website,
                zipCode,
                updatedAt,
                jobHiring,
                checkInTime,
                checkOutTime
            } = this.objParam!.data as PropertyClass;

            const checkUser = await checkAdminVerification(adminID);
            const ManagerPropertyCache = Cache.getCacheData(CacheKey.manager.property(checkUser.data.email));
            const UserPropertyCache = Cache.getCacheData(CacheKey.user.property);

            if (checkUser.error === '') {
                if (email === checkUser.data.email) {
                    this.objUserResponse = GetUserErrorObj(
                        'You cannot use your register email as public email.',
                        HttpStatusCodes.NOT_ACCEPTABLE
                    );
                } else {
                    const _Property = await PropertyModel.create({
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
                        checkOutTime: checkOutTime
                    });

                    // const insert = await PropertyModel.insertMany(dummy)

                    const isSave = await _Property.save();

                    if (isSave) {
                        this.objUserResponse = GetUserSuccessObj(
                            `Success: New ` + propertyType + ` has been created.`,
                            HttpStatusCodes.CREATED
                        );
                        if (ManagerPropertyCache.data !== '') {
                            Cache.ClearCache(CacheKey.manager.property(checkUser.data.email));
                        }
                        if (UserPropertyCache.data !== '') {
                            Cache.ClearCache(CacheKey.user.property);
                        }
                    } else {
                        this.objUserResponse = GetUserErrorObj(
                            `Server error not able to save ` + propertyType + `. Create Manager account first.`,
                            HttpStatusCodes.BAD_REQUEST
                        );
                    }
                }
            } else {
                this.objUserResponse = GetUserErrorObj(checkUser.error, HttpStatusCodes.NOT_ACCEPTABLE);
            }
        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_GATEWAY);
        } finally {
            return this.objUserResponse;
        }
    };

    public getSingleProperty = async (): Promise<UserResponse> => {
        try {
            const { adminID, propertyID } = this.objParam.data;
            const checkUser = await checkAdminVerification(adminID);
            if (checkUser.error === '') {
                const isProperty = await PropertyModel.findOne({
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
                    this.objUserResponse = GetUserSuccessObj(isProperty, HttpStatusCodes.OK);
                } else {
                    this.objUserResponse = GetUserErrorObj(
                        `Server error: Property id is not matching with admin, or wronge propertyID / admin  is provided`,
                        HttpStatusCodes.NOT_ACCEPTABLE
                    );
                }
            } else {
                this.objUserResponse = GetUserErrorObj(checkUser.error, HttpStatusCodes.NOT_ACCEPTABLE);
            }
        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_GATEWAY);
        } finally {
            return this.objUserResponse;
        }
    };

    public getAllProperty = async (): Promise<UserResponse> => {
        try {
            const id = this.objParam!.data;

            const checkUser = await checkAdminVerification(id);

            if (checkUser.error === '') {
                const ManagerPropertyCache = Cache.getCacheData(CacheKey.manager.property(checkUser.data.email));

                if (ManagerPropertyCache.error === '') {
                    this.objUserResponse = GetUserSuccessObj(ManagerPropertyCache.data, HttpStatusCodes.OK);
                } else {
                    // const allProperties: PropertyClass[] = await PropertyModel.find({ adminID: checkUser.data._id })
                    const allProperties: PropertyClass[] = await PropertyModel.find({ adminID: id }).populate({
                        path: 'rooms',
                        populate: {
                            path: 'property',
                        },
                    });
                    if (allProperties) {
                        Cache.SetCache(CacheKey.manager.property(checkUser.data.email), allProperties);
                        this.objUserResponse = GetUserSuccessObj(allProperties, HttpStatusCodes.OK);
                    }
                }
            } else {
                this.objUserResponse = GetUserErrorObj(checkUser.error, HttpStatusCodes.NOT_ACCEPTABLE);
            }
        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_GATEWAY);
        } finally {
            return this.objUserResponse;
        }
    };

    public updateProperty = async (): Promise<UserResponse> => {
        try {
            const {
                _id,
                address,
                adminID,
                amenities,
                city,
                country,
                createdAt,
                description,
                email,
                images,
                name,
                phone,
                propertyType,
                rooms,
                state,
                website,
                zipCode,
                updatedAt,
                jobHiring,
                checkInTime,
                checkOutTime
            } = this.objParam!.data as PropertyClass;

            const checkUser = await checkAdminVerification(adminID);

            if (checkUser.error === '') {
                if (email === checkUser.data.email) {
                    this.objUserResponse = GetUserErrorObj(
                        'You cannot use your register email as public email.',
                        HttpStatusCodes.NOT_ACCEPTABLE
                    );
                } else {
                    const ManagerPropertyCache = Cache.getCacheData(CacheKey.manager.property(checkUser.data.email));
                    const UserPropertyCache = Cache.getCacheData(CacheKey.user.property);
                    const ManagerRoomCache = Cache.getCacheData(CacheKey.manager.room(checkUser.data.email));
                    const UserRoomCache = Cache.getCacheData(CacheKey.user.room);

                    const isUpdated = await PropertyModel.findOneAndUpdate(
                        {
                            $and: [{ _id: _id }, { adminID: adminID }],
                        },
                        {
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
                                checkOutTime: checkOutTime
                            },
                        },
                        { new: true }
                    );

                    if (isUpdated) {
                        if (ManagerPropertyCache.data !== '') {
                            Cache.ClearCache(CacheKey.manager.property(checkUser.data.email));
                        }
                        if (UserPropertyCache.data !== '') {
                            Cache.ClearCache(CacheKey.user.property);
                        }
                        if (ManagerRoomCache.data !== '') {
                            Cache.ClearCache(CacheKey.manager.room(checkUser.data.email));
                        }
                        if (UserRoomCache.data !== '') {
                            Cache.ClearCache(CacheKey.user.room);
                        }
                        this.objUserResponse = GetUserSuccessObj(
                            `Success: Your ` + propertyType + ` has been Updated.`,
                            HttpStatusCodes.CREATED
                        );
                    } else {
                        this.objUserResponse = GetUserErrorObj(
                            `Server error not able to Update ` + propertyType + `. Create Manager account first. Might wrong credentials.`,
                            HttpStatusCodes.BAD_REQUEST
                        );
                    }
                }
            } else {
                this.objUserResponse = GetUserErrorObj(checkUser.error, HttpStatusCodes.NOT_ACCEPTABLE);
            }
        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_GATEWAY);
        } finally {
            return this.objUserResponse;
        }
    };

    public deleteProperty = async (): Promise<UserResponse> => {
        try {
            const { adminID, PropertyID } = this.objParam.data;
            const checkUser = await checkAdminVerification(adminID);

            if (checkUser.error === '') {
                const ManagerPropertyCache = Cache.getCacheData(CacheKey.manager.property(checkUser.data.email));
                const UserPropertyCache = Cache.getCacheData(CacheKey.user.property);
                const ManagerRoomCache = Cache.getCacheData(CacheKey.manager.room(checkUser.data.email));
                const UserRoomCache = Cache.getCacheData(CacheKey.user.room);

                const isDeleted = await PropertyModel.findOneAndDelete({
                    $and: [
                        {
                            _id: PropertyID,
                        },
                        {
                            adminID: adminID,
                        },
                    ],
                });

                if (isDeleted?.rooms.length! > 0) {
                    const isRoomDelete = await Room.deleteMany({ _id: { $in: isDeleted?.rooms } });

                    if (isRoomDelete) {
                        if (ManagerPropertyCache.data !== '') {
                            Cache.ClearCache(CacheKey.manager.property(checkUser.data.email));
                        }
                        if (UserPropertyCache.data !== '') {
                            Cache.ClearCache(CacheKey.user.property);
                        }
                        if (ManagerRoomCache.data !== '') {
                            Cache.ClearCache(CacheKey.manager.room(checkUser.data.email));
                        }
                        if (UserRoomCache.data !== '') {
                            Cache.ClearCache(CacheKey.user.room);
                        }
                        this.objUserResponse = GetUserSuccessObj(
                            `Success: Your ` + isDeleted!.propertyType + isDeleted!.name + ` has been Deleted.`,
                            HttpStatusCodes.OK
                        );
                    } else {
                        this.objUserResponse = GetUserErrorObj(
                            `Server error not able to Delete Rooms of ` +
                            isDeleted!.propertyType +
                            isDeleted!.name +
                            `. Create Manager account first. Might wrong credentials.`,
                            HttpStatusCodes.BAD_REQUEST
                        );
                    }
                } else {
                    if (isDeleted) {
                        if (ManagerPropertyCache.data !== '') {
                            Cache.ClearCache(CacheKey.manager.property(checkUser.data.email));
                        }
                        if (UserPropertyCache.data !== '') {
                            Cache.ClearCache(CacheKey.user.property);
                        }
                        this.objUserResponse = GetUserSuccessObj(
                            `Success: Your ` + isDeleted.propertyType + isDeleted.name + ` has been Deleted.`,
                            HttpStatusCodes.OK
                        );
                    } else {
                        this.objUserResponse = GetUserErrorObj(
                            `Server error not able to Delete ` +
                            isDeleted!.propertyType +
                            isDeleted!.name +
                            `. Create Manager account first. Might wrong credentials.`,
                            HttpStatusCodes.BAD_REQUEST
                        );
                    }
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

    // ---------------------- Guest ------------------------
    public getAllPropertyByCountry = async (): Promise<UserResponse> => {
        try {
            const { country } = this.objParam.data;

            const Properties: PropertyClass[] = await PropertyModel.find({ country: country }).populate({
                path: 'rooms',
                populate: {
                    path: 'property',
                },
            });

            this.objUserResponse = GetUserSuccessObj(Properties, HttpStatusCodes.OK);
        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_GATEWAY);
        } finally {
            return this.objUserResponse;
        }
    };

    public getTotalPropertyByCountry = async (): Promise<UserResponse> => {
        try {
            const { country } = this.objParam.data;

            const propertiesByState = await PropertyModel.aggregate([
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
            ]);

            this.objUserResponse = GetUserSuccessObj(propertiesByState, HttpStatusCodes.OK);
        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_GATEWAY);
        } finally {
            return this.objUserResponse;
        }
    };

    public getTotalPropertyByPropertType = async (): Promise<UserResponse> => {
        try {
            const { country } = this.objParam.data;

            const propertiesByState = await PropertyModel.aggregate([
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
            ]);

            this.objUserResponse = GetUserSuccessObj(propertiesByState, HttpStatusCodes.OK);
        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_GATEWAY);
        } finally {
            return this.objUserResponse;
        }
    };

    public GetPropertyListByFilterSearch = async (): Promise<UserResponse> => {
        try {
            const { FilterData } = this.objParam.data;

            const limit = 5;
            const skip = (Number(FilterData.page) - 1) * limit;

            const Properties = await PropertyModel.aggregate([
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
                        totalRooms: { $gte: 1 }
                    }
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
                        // roomDetails: 1,
                    },
                },
                {
                    $limit: limit,
                },
                {
                    $skip: skip,
                },
            ]);

            this.objUserResponse = GetUserSuccessObj(Properties, HttpStatusCodes.OK);
        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_GATEWAY);
        } finally {
            return this.objUserResponse;
        }
    };

    public GetSinglePropertyDetail = async (): Promise<UserResponse> => {
        try {
            const { country, state, propertyName, propertyID } = this.objParam.data

            const property = await PropertyModel.aggregate([
                {
                    $match: {
                        $and: [
                            {
                                _id: new mongoose.Types.ObjectId(propertyID)
                            },
                            {
                                country: country
                            },
                            {
                                state: state
                            },
                            {
                                name: propertyName.split('-').join(' ')
                            }
                        ]
                    },

                },
                {
                    $lookup: {
                        from: 'rooms',
                        localField: 'rooms',
                        foreignField: '_id',
                        as: 'rooms'
                    }
                },

                {
                    $lookup: {
                        from: 'reviews',
                        localField: 'reviews',
                        foreignField: '_id',
                        as: 'review'
                    }
                },

                {
                    $lookup: {
                        from: 'subscribers',
                        localField: '_id',
                        foreignField: 'property',
                        as: 'subscribersData'
                    }
                },

                {
                    $lookup: {
                        from: 'users',
                        localField: 'subscribersData.subscribers',
                        foreignField: '_id',
                        pipeline: [
                            { $project: { _id: 0, email: 1 } }
                        ],
                        as: 'subscribers'
                    }
                },

                {
                    $addFields: {
                        avgReview: {
                            $avg: {
                                $map: {
                                    input: { $ifNull: [{ $arrayElemAt: ['$review.reviewInfo', 0] }, []] },
                                    as: 'review',
                                    in: '$$review.rating'
                                }
                            }
                        },
                        review: { $arrayElemAt: ['$review', 0] },
                        subscribers: '$subscribers'
                    }
                },

                {
                    $unwind: '$rooms'
                },

                {
                    $group: {
                        _id: {
                            propertyID: '$_id',
                            roomType: '$rooms.type'
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
                                adminID: '$adminID'
                            }
                        }
                    }
                },

                {
                    $group: {
                        _id: '$_id.propertyID',
                        Rooms: {
                            $push: {
                                type: '$_id.roomType',
                                roomInfo: '$rooms'
                            }
                        },
                        avgReview: { $first: '$avgReview' },
                        review: { $first: '$review' },
                        subscribers: { $first: '$subscribers' },
                        propertyDetails: { $first: '$propertyDetails' }
                    }
                },

                {
                    $project: {
                        _id: 0,
                        propertyID: '$_id',
                        avgReview: 1,
                        review: 1,
                        propertyDetails: 1,
                        Rooms: 1,
                        subscribers: 1
                    }
                }
            ])


            if (property.length > 0) {

                this.objUserResponse = GetUserSuccessObj(property[0], HttpStatusCodes.OK);
            } else {
                this.objUserResponse = GetUserErrorObj('The property you are looking for is not available might wron url. Please try for another property', HttpStatusCodes.NOT_FOUND);
            }
        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_GATEWAY);
        } finally {
            return this.objUserResponse;
        }
    };

}


const getPropertyFilterAndCondition = (FilterData: any) => {
    const { Price, state, city, propertyType, page, country } = FilterData;

    let and: FilterQuery<any>[] = [];

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

const getMaxPrice = (FilterData: any): number => {
    const { Price } = FilterData;
    let maxPrice: number = 1000000000000;
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

const PropertFilterPipeLine = [];
