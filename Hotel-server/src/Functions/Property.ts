import { NextFunction, Request, Response } from 'express';
import { Cache, GetUserErrorObj, GetUserSuccessObj, HttpStatusCodes, UserResponse } from '../common';
import { TParam } from '../types/Type';
import { Param, CacheKey } from '../Constant';
import { Property as PropertyModel, PropertyClass, enumPropertyType } from '../models/PropertyModel';
// import { User, UserClass, enumUserRole } from '';
import { checkAdminVerification } from '../middleware/AdiminVerification';
import { Room } from '../models/RoomModel';
import { FilterQuery } from 'mongoose';

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

}

//const ids= ['hgihgiy','ojgorg','hrgrhguh'] her i want to delete all the room whose _id is indide this using mongoose operators not bu any js loop

const dummy = [
    {
        adminID: '66a0fd77e896ce4722a7edbd',
        name: 'Luxury Hotel',
        propertyType: enumPropertyType.Hotel,
        address: '101 Elite Street',
        city: 'New Delhi',
        state: 'Delhi-DL',
        country: 'India-IN',
        zipCode: '110001',
        phone: '+919123456789',
        email: 'info@luxuryhotel.com',
        website: 'http://www.luxuryhotel.com',
        description: 'A luxurious hotel in the capital city.',
        amenities: ['Spa', 'Gym', 'Swimming Pool'],
        images: [],
        rooms: [],
        jobHiring: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        adminID: '66a0fd77e896ce4722a7edbd',
        name: 'Eco Resort',
        propertyType: enumPropertyType.Resort,
        address: '202 Green Avenue',
        city: 'Mysore',
        state: 'Karnataka-KA',
        country: 'India-IN',
        zipCode: '570001',
        phone: '+919234567890',
        email: 'contact@ecoresort.com',
        website: 'http://www.ecoresort.com',
        description: 'An eco-friendly resort surrounded by nature.',
        amenities: ['Organic Meals', 'Nature Walks', 'Yoga Classes'],
        images: [],
        rooms: [],
        jobHiring: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        adminID: '66a0fd77e896ce4722a7edbd',
        name: 'City Loft',
        propertyType: enumPropertyType.Apartment,
        address: '303 High Street',
        city: 'Hyderabad',
        state: 'Telangana-TG',
        country: 'India-IN',
        zipCode: '500001',
        phone: '+919345678901',
        email: 'stay@cityloft.com',
        website: 'http://www.cityloft.com',
        description: 'Modern apartments in the bustling city.',
        amenities: ['24/7 Security', 'Gym', 'Rooftop Garden'],
        images: [],
        rooms: [],
        jobHiring: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        adminID: '66a0fd77e896ce4722a7edbd',
        name: 'Seaside Bungalow',
        propertyType: enumPropertyType.Bungalow,
        address: '404 Ocean View',
        city: 'Visakhapatnam',
        state: 'Andhra Pradesh-AP',
        country: 'India-IN',
        zipCode: '530001',
        phone: '+919456789012',
        email: 'stay@seasidebungalow.com',
        website: 'http://www.seasidebungalow.com',
        description: 'A cozy bungalow with a beautiful sea view.',
        amenities: ['Private Beach', 'Barbecue Area', 'Free WiFi'],
        images: [],
        rooms: [],
        jobHiring: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        adminID: '66a0fd77e896ce4722a7edbd',
        name: 'Palace Hotel',
        propertyType: enumPropertyType.Hotel,
        address: '505 Royal Road',
        city: 'Lucknow',
        state: 'Uttar Pradesh-UP',
        country: 'India-IN',
        zipCode: '226001',
        phone: '+919567890123',
        email: 'contact@palacehotel.com',
        website: 'http://www.palacehotel.com',
        description: 'A historic hotel with royal architecture.',
        amenities: ['Museum', 'Cultural Tours', 'Restaurant'],
        images: [],
        rooms: [],
        jobHiring: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        adminID: '66a0fd77e896ce4722a7edbd',
        name: 'Urban Suites',
        propertyType: enumPropertyType.Apartment,
        address: '606 City Square',
        city: 'Pune',
        state: 'Maharashtra-MH',
        country: 'India-IN',
        zipCode: '411001',
        phone: '+919678901234',
        email: 'admin@urbansuites.com',
        website: 'http://www.urbansuites.com',
        description: 'Stylish apartments in the urban center.',
        amenities: ['Gym', 'Parking', 'Concierge Service'],
        images: [],
        rooms: [],
        jobHiring: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        adminID: '66a0fd77e896ce4722a7edbd',
        name: 'Heritage Resort',
        propertyType: enumPropertyType.Resort,
        address: '707 Historic Lane',
        city: 'Udaipur',
        state: 'Rajasthan-RJ',
        country: 'India-IN',
        zipCode: '313001',
        phone: '+919789012345',
        email: 'contact@heritageresort.com',
        website: 'http://www.heritageresort.com',
        description: 'A resort with a blend of history and luxury.',
        amenities: ['Spa', 'Cultural Programs', 'Restaurant'],
        images: [],
        rooms: [],
        jobHiring: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        adminID: '66a0fd77e896ce4722a7edbd',
        name: 'Mountain Villa',
        propertyType: enumPropertyType.Bungalow,
        address: '808 Hilltop Way',
        city: 'Shimla',
        state: 'Himachal Pradesh-HP',
        country: 'India-IN',
        zipCode: '171001',
        phone: '+919890123456',
        email: 'stay@mountainvilla.com',
        website: 'http://www.mountainvilla.com',
        description: 'A serene villa in the mountains.',
        amenities: ['Fireplace', 'Hiking Trails', 'Free WiFi'],
        images: [],
        rooms: [],
        jobHiring: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        adminID: '66a0fd77e896ce4722a7edbd',
        name: 'Riverside Apartment',
        propertyType: enumPropertyType.Apartment,
        address: '909 Riverfront',
        city: 'Ahmedabad',
        state: 'Gujarat-GJ',
        country: 'India-IN',
        zipCode: '380001',
        phone: '+919901234567',
        email: 'admin@riversideapartment.com',
        website: 'http://www.riversideapartment.com',
        description: 'Modern apartments with a river view.',
        amenities: ['Gym', 'Swimming Pool', '24/7 Security'],
        images: [],
        rooms: [],
        jobHiring: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        adminID: '66a0fd77e896ce4722a7edbd',
        name: 'Boutique Hotel',
        propertyType: enumPropertyType.Hotel,
        address: '1010 Chic Street',
        city: 'Chandigarh',
        state: 'Punjab-PB',
        country: 'India-IN',
        zipCode: '160001',
        phone: '+919912345678',
        email: 'contact@boutiquehotel.com',
        website: 'http://www.boutiquehotel.com',
        description: 'A stylish boutique hotel.',
        amenities: ['Spa', 'Free Breakfast', 'Restaurant'],
        images: [],
        rooms: [],
        jobHiring: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

const getPropertyFilterAndCondition = (FilterData: any) => {
    const { Price, state, city, propertyType, page, country } = FilterData;
    console.log(FilterData);

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
