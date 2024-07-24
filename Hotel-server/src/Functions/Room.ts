import { NextFunction, Request, Response } from 'express';
import { CacheKey, Param } from '../Constant';
import { TParam } from '../types/Type';
import { HttpStatusCodes, GetUserErrorObj, UserResponse, Cache, GetUserSuccessObj } from '../common';
import { enumRoomType, Room, RoomClass } from '../models/RoomModel';
import { checkAdminVerification } from '../middleware/AdiminVerification';
import { Property } from '../models/PropertyModel';

const _AddRoom = Param.function.manager.Room.AddRoom;
const _UpdateRoom = Param.function.manager.Room.UpdateRoom;
const _DeleteRoom = Param.function.manager.Room.DeleteRoom;
const _GetAllRoom = Param.function.manager.Room.GetAllRoom;

export class RoomFunction {
    private static objUserResponse: UserResponse = new UserResponse();

    static findFunction = async (objParam: TParam, req: Request, res: Response, next: NextFunction): Promise<UserResponse> => {
        let _Function = new Functions();
        _Function.req = req;
        _Function.res = res;
        _Function.next = next;
        _Function.objParam = objParam;

        if (objParam.function === _AddRoom) {
            const _res = await _Function.addRoom();
            this.objUserResponse = _res;
        } else if (objParam.function === _GetAllRoom) {
            const _res = await _Function.getAllRooms();
            this.objUserResponse = _res;
        } else if (objParam.function === _UpdateRoom) {
            const _res = await _Function.updateRoom();
            this.objUserResponse = _res;
        } else if (objParam.function === _DeleteRoom) {
            const _res = await _Function.deleteRoom();
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

    public addRoom = async (): Promise<UserResponse> => {
        try {
            const {
                adminID,
                amenities,
                createdAt,
                description,
                isAvailable,
                maxOccupancy,
                price,
                property,
                roomNumber,
                type,
                updatedAt,
                images,
            } = this.objParam.data as RoomClass;

            const isUser = await checkAdminVerification(adminID);

            if (isUser.error === '') {
                const ManagerRoomCache = Cache.getCacheData(CacheKey.manager.room(isUser.data.email));
                const ManagerPropertyCache = Cache.getCacheData(CacheKey.manager.property(isUser.data.email));
                const UserRoomCache = Cache.getCacheData(CacheKey.user.room);
                const UserPropertyCache = Cache.getCacheData(CacheKey.user.property);

                const isAvailableRoom = await Room.findOne({
                    $and: [
                        {
                            type: type
                        },
                        {
                            roomNumber: roomNumber
                        },
                        {
                            property: property._id
                        }
                    ]
                })

                if (isAvailableRoom) {
                    this.objUserResponse = GetUserErrorObj(`Server error: Same room type/ Same room number/ and same property already present change any of one. `, HttpStatusCodes.NOT_ACCEPTABLE);

                } else {

                    const newRoom = await Room.create({
                        adminID: adminID,
                        amenities: amenities,
                        createdAt: createdAt,
                        description: description,
                        isAvailable: isAvailable,
                        maxOccupancy: maxOccupancy,
                        price: price,
                        property: property._id,
                        roomNumber: roomNumber,
                        type: type,
                        updatedAt: updatedAt,
                        images: images,
                    });

                    await newRoom.save();

                    // const manyRoom = await Room.insertMany(dummy)

                    if (newRoom) {
                        // const isRoom = await Property.findOne({ rooms: newRoom._id })

                        // if (isRoom === null || isRoom === undefined) {


                        const isPropertyUpdated = await Property.findByIdAndUpdate(
                            { _id: property._id },
                            {
                                $push: {
                                    rooms: newRoom._id,
                                },
                            }
                        );

                        if (isPropertyUpdated) {
                            if (ManagerRoomCache.data !== '') {
                                Cache.ClearCache(CacheKey.manager.room(isUser.data.email));
                            }
                            if (ManagerPropertyCache.data !== '') {
                                Cache.ClearCache(CacheKey.manager.property(isUser.data.email));
                            }
                            if (UserRoomCache.data !== '') {
                                Cache.ClearCache(CacheKey.user.room);
                            }
                            if (UserPropertyCache.data !== '') {
                                Cache.ClearCache(CacheKey.user.property);
                            }
                            this.objUserResponse = GetUserSuccessObj(
                                `Success: New Room have been created for property `,
                                HttpStatusCodes.CREATED
                            );

                        } else {
                            this.objUserResponse = GetUserErrorObj(
                                `Server error : Unable to update your property after creating room.`,
                                HttpStatusCodes.BAD_REQUEST
                            );
                        }
                        // } else {
                        //     this.objUserResponse = GetUserErrorObj(
                        //         `Server error : Create new room. This room is already being created.`,
                        //         HttpStatusCodes.BAD_REQUEST
                        //     );
                        // }
                    } else {
                        this.objUserResponse = GetUserErrorObj(`Server error not able to save Room `, HttpStatusCodes.BAD_REQUEST);
                    }

                }


                //delete room cach fro property adding
            } else {
                this.objUserResponse = GetUserErrorObj(isUser.error, HttpStatusCodes.NOT_ACCEPTABLE);
            }
        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_REQUEST);
        } finally {
            return this.objUserResponse;
        }
    };

    public getAllRooms = async (): Promise<UserResponse> => {
        try {
            const adminID = this.objParam.data;

            const isUser = await checkAdminVerification(adminID);

            if (isUser.error === '') {
                const ManagerRoomCache = Cache.getCacheData(CacheKey.manager.room(isUser.data.email));

                if (ManagerRoomCache.error === '') {
                    this.objUserResponse = GetUserSuccessObj(ManagerRoomCache.data, HttpStatusCodes.OK);
                } else {
                    const allRooms = await Room.find({ adminID: adminID }).populate('property').exec();
                    if (allRooms) {
                        Cache.SetCache(CacheKey.manager.room(isUser.data.email), allRooms);
                        this.objUserResponse = GetUserSuccessObj(allRooms, HttpStatusCodes.OK);
                    }
                }
            } else {
                this.objUserResponse = GetUserErrorObj(isUser.error, HttpStatusCodes.NOT_ACCEPTABLE);
            }
        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_GATEWAY);
        } finally {
            return this.objUserResponse;
        }
    };

    public updateRoom = async (): Promise<UserResponse> => {
        try {
            const { _id, adminID, amenities, description, images, isAvailable, maxOccupancy, price, roomNumber, type, updatedAt } = this.objParam.data as RoomClass
            const isUser = await checkAdminVerification(adminID);
            if (isUser.error === '') {
                const ManagerRoomCache = Cache.getCacheData(CacheKey.manager.room(isUser.data.email));
                const ManagerPropertyCache = Cache.getCacheData(CacheKey.manager.property(isUser.data.email));
                const UserRoomCache = Cache.getCacheData(CacheKey.user.room);
                const UserPropertyCache = Cache.getCacheData(CacheKey.user.property);

                const isUpdated = await Room.findOneAndUpdate({ $and: [{ _id: _id }, { adminID: adminID }] }, {
                    $set: {
                        amenities: amenities,
                        description: description,
                        images: images,
                        isAvailable: isAvailable,
                        maxOccupancy: maxOccupancy,
                        price: price,
                        roomNumber: roomNumber,
                        type: type,
                        updatedAt: updatedAt
                    }
                })

                if (isUpdated) {

                    if (ManagerRoomCache.data !== '') {
                        Cache.ClearCache(CacheKey.manager.room(isUser.data.email));
                    }
                    if (ManagerPropertyCache.data !== '') {
                        Cache.ClearCache(CacheKey.manager.property(isUser.data.email));
                    }
                    if (UserRoomCache.data !== '') {
                        Cache.ClearCache(CacheKey.user.room);
                    }
                    if (UserPropertyCache.data !== '') {
                        Cache.ClearCache(CacheKey.user.property);
                    }
                    this.objUserResponse = GetUserSuccessObj(
                        `Success: Your Room has been Updated `,
                        HttpStatusCodes.CREATED
                    );

                } else {
                    this.objUserResponse = GetUserErrorObj(`Server error not able to update Room `, HttpStatusCodes.BAD_REQUEST);
                }
            } else {
                this.objUserResponse = GetUserErrorObj(isUser.error, HttpStatusCodes.NOT_ACCEPTABLE);
            }

        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_GATEWAY);
        } finally {
            return this.objUserResponse
        }
    }

    public deleteRoom = async (): Promise<UserResponse> => {
        try {
            const { adminID, RoomID } = this.objParam.data
            const isUser = await checkAdminVerification(adminID);
            if (isUser.error === '') {
                const ManagerRoomCache = Cache.getCacheData(CacheKey.manager.room(isUser.data.email));
                const ManagerPropertyCache = Cache.getCacheData(CacheKey.manager.property(isUser.data.email));
                const UserRoomCache = Cache.getCacheData(CacheKey.user.room);
                const UserPropertyCache = Cache.getCacheData(CacheKey.user.property);

                const isDeleted = await Room.findOneAndDelete({ $and: [{ _id: RoomID }, { adminID: adminID }] })



                if (isDeleted) {
                    const isPropertyUpdated = await Property.findOneAndUpdate({ _id: isDeleted.property }, {
                        $pull: {
                            rooms: isDeleted._id
                        }
                    })


                    if (isPropertyUpdated) {
                        if (ManagerRoomCache.data !== '') {
                            Cache.ClearCache(CacheKey.manager.room(isUser.data.email));
                        }
                        if (ManagerPropertyCache.data !== '') {
                            Cache.ClearCache(CacheKey.manager.property(isUser.data.email));
                        }
                        if (UserRoomCache.data !== '') {
                            Cache.ClearCache(CacheKey.user.room);
                        }
                        if (UserPropertyCache.data !== '') {
                            Cache.ClearCache(CacheKey.user.property);
                        }
                        this.objUserResponse = GetUserSuccessObj(
                            `Success: Your Room has been deleted `,
                            HttpStatusCodes.CREATED
                        );


                    } else {
                        this.objUserResponse = GetUserErrorObj('Server error: Not able to remove Room from property after deleting. ', HttpStatusCodes.BAD_REQUEST);
                    }

                } else {
                    this.objUserResponse = GetUserErrorObj('Server error: Not able to delete Room. ', HttpStatusCodes.BAD_REQUEST);
                }




            } else {
                this.objUserResponse = GetUserErrorObj(isUser.error, HttpStatusCodes.NOT_ACCEPTABLE);
            }

        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_GATEWAY);
        } finally {
            return this.objUserResponse
        }
    }
}

// const dummy: RoomClass[] = []
const dummy = [
    {
        adminID: '66a0fd77e896ce4722a7edbd',
        property: '66a10029f036824d857a9f2d',
        roomNumber: 1,
        type: enumRoomType.Single_Room,
        description: 'A cozy single room with a comfortable bed, ideal for solo travelers seeking comfort and privacy.',
        amenities: ['Free Wi-Fi', 'Air Conditioning', 'Private Bathroom', 'Flat-screen TV'],
        images: [],
        price: 1200,
        maxOccupancy: 1,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        adminID: '66a0fd77e896ce4722a7edbd',
        property: '66a10029f036824d857a9f2e',
        roomNumber: 2,
        type: enumRoomType.Double_Room,
        description: 'A spacious double room with two comfortable beds, perfect for couples or friends traveling together.',
        amenities: ['Free Wi-Fi', 'Air Conditioning', 'Private Bathroom', 'Mini Bar', 'Balcony'],
        images: [],
        price: 2200,
        maxOccupancy: 4,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        adminID: '66a0fd77e896ce4722a7edbd',
        property: '66a10029f036824d857a9f2f',
        roomNumber: 3,
        type: enumRoomType.Triple_Room,
        description: 'A triple room featuring three beds, ideal for small groups or families.',
        amenities: ['Free Wi-Fi', 'Air Conditioning', 'Private Bathroom', 'Flat-screen TV', 'Mini Bar'],
        images: [],
        price: 3000,
        maxOccupancy: 3,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        adminID: '66a0fd77e896ce4722a7edbd',
        property: '66a10029f036824d857a9f30',
        roomNumber: 4,
        type: enumRoomType.King_Room,
        description: 'A luxurious room with a king-sized bed, offering extra space and comfort for a premium experience.',
        amenities: ['Free Wi-Fi', 'Air Conditioning', 'Private Bathroom', 'Flat-screen TV', 'Mini Bar', 'Bathrobe'],
        images: [],
        price: 3500,
        maxOccupancy: 2,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        adminID: '66a0fd77e896ce4722a7edbd',
        property: '66a10029f036824d857a9f2d',
        roomNumber: 5,
        type: enumRoomType.Executive_Room,
        description: 'An executive room offering a blend of luxury and functionality, ideal for business travelers.',
        amenities: ['Free Wi-Fi', 'Air Conditioning', 'Private Bathroom', 'Flat-screen TV', 'Work Desk', 'Mini Bar'],
        images: [],
        price: 4000,
        maxOccupancy: 2,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        adminID: '66a0fd77e896ce4722a7edbd',
        property: '66a10029f036824d857a9f2e',
        roomNumber: 6,
        type: enumRoomType.Queen_Room,
        description: 'A comfortable queen room with a spacious layout and modern amenities, perfect for a relaxing stay.',
        amenities: ['Free Wi-Fi', 'Air Conditioning', 'Private Bathroom', 'Flat-screen TV', 'Mini Bar'],
        images: [],
        price: 2700,
        maxOccupancy: 2,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        adminID: '66a0fd77e896ce4722a7edbd',
        property: '66a10029f036824d857a9f2f',
        roomNumber: 7,
        type: enumRoomType.Juniour_Suites,
        description: 'A junior suite offering extra space with a separate sitting area for added comfort and luxury.',
        amenities: ['Free Wi-Fi', 'Air Conditioning', 'Private Bathroom', 'Flat-screen TV', 'Mini Bar', 'Sofa'],
        images: [],
        price: 5000,
        maxOccupancy: 4,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        adminID: '66a0fd77e896ce4722a7edbd',
        property: '66a10029f036824d857a9f2d',
        roomNumber: 8,
        type: enumRoomType.Single_Room,
        description: 'Compact and functional room for single occupancy, with essential amenities for a comfortable stay.',
        amenities: ['Free Wi-Fi', 'Air Conditioning', 'Private Bathroom'],
        images: [],
        price: 1300,
        maxOccupancy: 1,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        adminID: '66a0fd77e896ce4722a7edbd',
        property: '66a10029f036824d857a9f2e',
        roomNumber: 9,
        type: enumRoomType.Double_Room,
        description: 'Bright and airy double room with excellent facilities for a comfortable stay.',
        amenities: ['Free Wi-Fi', 'Air Conditioning', 'Private Bathroom', 'Flat-screen TV', 'Mini Bar'],
        images: [],
        price: 2400,
        maxOccupancy: 4,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        adminID: '66a0fd77e896ce4722a7edbd',
        property: '66a10029f036824d857a9f2d',
        roomNumber: 10,
        type: enumRoomType.Triple_Room,
        description: 'Spacious triple room with comfortable beds, perfect for families or small groups.',
        amenities: ['Free Wi-Fi', 'Air Conditioning', 'Private Bathroom', 'Flat-screen TV', 'Mini Bar'],
        images: [],
        price: 3300,
        maxOccupancy: 3,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        adminID: '66a0fd77e896ce4722a7edbd',
        property: '66a10029f036824d857a9f2e',
        roomNumber: 11,
        type: enumRoomType.King_Room,
        description: 'Luxurious king room with modern decor and top-notch amenities for a premium experience.',
        amenities: ['Free Wi-Fi', 'Air Conditioning', 'Private Bathroom', 'Flat-screen TV', 'Mini Bar', 'Jacuzzi'],
        images: [],
        price: 3700,
        maxOccupancy: 2,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        adminID: '66a0fd77e896ce4722a7edbd',
        property: '66a10029f036824d857a9f2d',
        roomNumber: 12,
        type: enumRoomType.Executive_Room,
        description: 'Executive room with enhanced amenities for business travelers, featuring a spacious work desk and premium comforts.',
        amenities: ['Free Wi-Fi', 'Air Conditioning', 'Private Bathroom', 'Flat-screen TV', 'Work Desk', 'Mini Bar'],
        images: [],
        price: 4200,
        maxOccupancy: 2,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        adminID: '66a0fd77e896ce4722a7edbd',
        property: '66a10029f036824d857a9f2e',
        roomNumber: 13,
        type: enumRoomType.Queen_Room,
        description: 'Spacious queen room with a modern design and all essential amenities for a relaxing stay.',
        amenities: ['Free Wi-Fi', 'Air Conditioning', 'Private Bathroom', 'Flat-screen TV', 'Mini Bar'],
        images: [],
        price: 2800,
        maxOccupancy: 2,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        adminID: '66a0fd77e896ce4722a7edbd',
        property: '66a10029f036824d857a9f2d',
        roomNumber: 14,
        type: enumRoomType.Juniour_Suites,
        description: 'Elegant junior suite with separate living and sleeping areas, perfect for a luxurious stay.',
        amenities: ['Free Wi-Fi', 'Air Conditioning', 'Private Bathroom', 'Flat-screen TV', 'Mini Bar', 'Sofa'],
        images: [],
        price: 5300,
        maxOccupancy: 4,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        adminID: '66a0fd77e896ce4722a7edbd',
        property: '66a10029f036824d857a9f2e',
        roomNumber: 15,
        type: enumRoomType.Single_Room,
        description: 'Simple single room with essential amenities for a comfortable solo stay.',
        amenities: ['Free Wi-Fi', 'Air Conditioning', 'Private Bathroom', 'Desk'],
        images: [],
        price: 1400,
        maxOccupancy: 1,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        adminID: '66a0fd77e896ce4722a7edbd',
        property: '66a10029f036824d857a9f2e',
        roomNumber: 16,
        type: enumRoomType.Double_Room,
        description: 'Well-furnished double room with a comfortable layout for a pleasant stay.',
        amenities: ['Free Wi-Fi', 'Air Conditioning', 'Private Bathroom', 'Flat-screen TV', 'Mini Bar'],
        images: [],
        price: 2500,
        maxOccupancy: 4,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        adminID: '66a0fd77e896ce4722a7edbd',
        property: '66a10029f036824d857a9f2f',
        roomNumber: 17,
        type: enumRoomType.Triple_Room,
        description: 'Comfortable triple room with additional beds for families or small groups.',
        amenities: ['Free Wi-Fi', 'Air Conditioning', 'Private Bathroom', 'Flat-screen TV', 'Mini Bar'],
        images: [],
        price: 3200,
        maxOccupancy: 3,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        adminID: '66a0fd77e896ce4722a7edbd',
        property: '66a10029f036824d857a9f2e',
        roomNumber: 18,
        type: enumRoomType.King_Room,
        description: 'Luxurious king room with elegant furnishings and premium amenities for a grand stay.',
        amenities: ['Free Wi-Fi', 'Air Conditioning', 'Private Bathroom', 'Flat-screen TV', 'Mini Bar', 'Jacuzzi'],
        images: [],
        price: 3600,
        maxOccupancy: 2,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        adminID: '66a0fd77e896ce4722a7edbd',
        property: '66a10029f036824d857a9f2e',
        roomNumber: 19,
        type: enumRoomType.Executive_Room,
        description: 'Executive room with modern amenities and a large work desk, designed for business travelers.',
        amenities: ['Free Wi-Fi', 'Air Conditioning', 'Private Bathroom', 'Flat-screen TV', 'Work Desk', 'Mini Bar'],
        images: [],
        price: 4300,
        maxOccupancy: 2,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        adminID: '66a0fd77e896ce4722a7edbd',
        property: '66a10029f036824d857a9f2e',
        roomNumber: 20,
        type: enumRoomType.Juniour_Suites,
        description: 'Spacious junior suite with a separate living area, perfect for a luxurious and comfortable stay.',
        amenities: ['Free Wi-Fi', 'Air Conditioning', 'Private Bathroom', 'Flat-screen TV', 'Mini Bar', 'Sofa'],
        images: [],
        price: 5400,
        maxOccupancy: 4,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
    }
];