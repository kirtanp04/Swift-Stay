import { NextFunction, Request, Response } from 'express';
import { Cache, GetUserErrorObj, GetUserSuccessObj, HttpStatusCodes, UserResponse } from '../common';
import { TParam } from '../types/Type';
import { Param, CacheKey } from '../Constant';
import { Property as PropertyModel, PropertyClass } from '../models/PropertyModel';
// import { User, UserClass, enumUserRole } from '';
import { checkAdminVerification } from '../middleware/AdiminVerification';
import { Room } from '../models/RoomModel';

const _AddProperty = Param.function.manager.Property.AddProperty;
const _GetSingleProperty = Param.function.manager.Property.GetSingleProperty;
const _GetAllProperty = Param.function.manager.Property.GetAllProperty;
const _UpdateProperty = Param.function.manager.Property.UpdateProperty;
const _DeleteProperty = Param.function.manager.Property.DeleteProperty;

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
            } = this.objParam!.data as PropertyClass;

            const checkUser = await checkAdminVerification(adminID);
            const ManagerPropertyCache = Cache.getCacheData(CacheKey.manager.property(checkUser.data.email));
            const UserPropertyCache = Cache.getCacheData(CacheKey.user.property);

            if (checkUser.error === '') {
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
                });

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
                    const allProperties: PropertyClass[] = await PropertyModel.find({ adminID: checkUser.data._id })
                        .populate({
                            path: 'rooms',
                            populate: {
                                path: 'property',
                            },
                        })
                        .exec();
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
            } = this.objParam!.data as PropertyClass;

            const checkUser = await checkAdminVerification(adminID);

            if (checkUser.error === '') {
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
}

//const ids= ['hgihgiy','ojgorg','hrgrhguh'] her i want to delete all the room whose _id is indide this using mongoose operators not bu any js loop
