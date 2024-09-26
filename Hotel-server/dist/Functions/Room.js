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
exports.RoomFunction = void 0;
const Constant_1 = require("../Constant");
const Type_1 = require("../types/Type");
const common_1 = require("../common");
const RoomModel_1 = require("../models/RoomModel");
const AdiminVerification_1 = require("../middleware/AdiminVerification");
const PropertyModel_1 = require("../models/PropertyModel");
const GuestVerification_1 = require("../middleware/GuestVerification");
const _AddRoom = Constant_1.Param.function.manager.Room.AddRoom;
const _UpdateRoom = Constant_1.Param.function.manager.Room.UpdateRoom;
const _DeleteRoom = Constant_1.Param.function.manager.Room.DeleteRoom;
const _GetAllRoom = Constant_1.Param.function.manager.Room.GetAllRoom;
const _GuestGetRoomDetail = Constant_1.Param.function.guest.room.GetRoomDetail;
class RoomFunction {
}
exports.RoomFunction = RoomFunction;
_a = RoomFunction;
RoomFunction.objUserResponse = new common_1.UserResponse();
RoomFunction.findFunction = (objParam, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let _Function = new Functions();
    _Function.req = req;
    _Function.res = res;
    _Function.next = next;
    _Function.objParam = objParam;
    if (objParam.function === _AddRoom) {
        const _res = yield _Function.addRoom();
        _a.objUserResponse = _res;
    }
    else if (objParam.function === _GetAllRoom) {
        const _res = yield _Function.getAllRooms();
        _a.objUserResponse = _res;
    }
    else if (objParam.function === _UpdateRoom) {
        const _res = yield _Function.updateRoom();
        _a.objUserResponse = _res;
    }
    else if (objParam.function === _DeleteRoom) {
        const _res = yield _Function.deleteRoom();
        _a.objUserResponse = _res;
    }
    else if (objParam.function === _GuestGetRoomDetail) {
        const _res = yield _Function.getRoomDetail();
        _a.objUserResponse = _res;
    }
    else {
        _a.objUserResponse = (0, common_1.GetUserErrorObj)('Server error: Wronge Function.', common_1.HttpStatusCodes.BAD_REQUEST);
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
        this.addRoom = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const { adminID, amenities, createdAt, description, isAvailable, maxOccupancy, price, property, roomNumber, type, updatedAt, images, } = this.objParam.data;
                const isUser = yield (0, AdiminVerification_1.checkAdminVerification)(adminID);
                if (isUser.error === '') {
                    const ManagerRoomCache = common_1.Cache.getCacheData(Constant_1.CacheKey.manager.room(isUser.data.email));
                    const ManagerPropertyCache = common_1.Cache.getCacheData(Constant_1.CacheKey.manager.property(isUser.data.email));
                    const UserPropertyCache = common_1.Cache.getCacheData(Constant_1.CacheKey.user.property(property._id));
                    const isAvailableRoom = yield RoomModel_1.Room.findOne({
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
                    });
                    if (isAvailableRoom) {
                        this.objUserResponse = (0, common_1.GetUserErrorObj)(`Server error: Same room type/ Same room number/ and same property already present change any of one. `, common_1.HttpStatusCodes.NOT_ACCEPTABLE);
                    }
                    else {
                        const newRoom = yield RoomModel_1.Room.create({
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
                        yield newRoom.save();
                        if (newRoom) {
                            const isPropertyUpdated = yield PropertyModel_1.Property.findByIdAndUpdate({ _id: property._id }, {
                                $push: {
                                    rooms: newRoom._id,
                                },
                            });
                            if (isPropertyUpdated) {
                                if (ManagerRoomCache.data !== '') {
                                    common_1.Cache.ClearCache(Constant_1.CacheKey.manager.room(isUser.data.email));
                                }
                                if (ManagerPropertyCache.data !== '') {
                                    common_1.Cache.ClearCache(Constant_1.CacheKey.manager.property(isUser.data.email));
                                }
                                if (UserPropertyCache.data !== '') {
                                    common_1.Cache.ClearCache(Constant_1.CacheKey.user.property(property._id));
                                }
                                this.objUserResponse = (0, common_1.GetUserSuccessObj)(`Success: New Room have been created for property `, common_1.HttpStatusCodes.CREATED);
                            }
                            else {
                                this.objUserResponse = (0, common_1.GetUserErrorObj)(`Server error : Unable to update your property after creating room.`, common_1.HttpStatusCodes.BAD_REQUEST);
                            }
                        }
                        else {
                            this.objUserResponse = (0, common_1.GetUserErrorObj)(`Server error not able to save Room `, common_1.HttpStatusCodes.BAD_REQUEST);
                        }
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
        this.getAllRooms = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const adminID = this.objParam.data;
                const isUser = yield (0, AdiminVerification_1.checkAdminVerification)(adminID);
                if (isUser.error === '') {
                    const ManagerRoomCache = common_1.Cache.getCacheData(Constant_1.CacheKey.manager.room(isUser.data.email));
                    if (ManagerRoomCache.error === '') {
                        this.objUserResponse = (0, common_1.GetUserSuccessObj)(ManagerRoomCache.data, common_1.HttpStatusCodes.OK);
                    }
                    else {
                        const allRooms = yield RoomModel_1.Room.find({ adminID: adminID }).populate('property').exec();
                        if (allRooms) {
                            common_1.Cache.SetCache(Constant_1.CacheKey.manager.room(isUser.data.email), allRooms);
                            this.objUserResponse = (0, common_1.GetUserSuccessObj)(allRooms, common_1.HttpStatusCodes.OK);
                        }
                    }
                }
                else {
                    this.objUserResponse = (0, common_1.GetUserErrorObj)(isUser.error, common_1.HttpStatusCodes.NOT_ACCEPTABLE);
                }
            }
            catch (error) {
                this.objUserResponse = (0, common_1.GetUserErrorObj)(error.message, common_1.HttpStatusCodes.BAD_GATEWAY);
            }
            finally {
                return this.objUserResponse;
            }
        });
        this.updateRoom = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id, adminID, amenities, description, images, isAvailable, maxOccupancy, price, roomNumber, type, updatedAt } = this.objParam.data;
                const isUser = yield (0, AdiminVerification_1.checkAdminVerification)(adminID);
                if (isUser.error === '') {
                    const ManagerRoomCache = common_1.Cache.getCacheData(Constant_1.CacheKey.manager.room(isUser.data.email));
                    const ManagerPropertyCache = common_1.Cache.getCacheData(Constant_1.CacheKey.manager.property(isUser.data.email));
                    const UserRoomCache = common_1.Cache.getCacheData(Constant_1.CacheKey.user.room(_id));
                    const isUpdated = yield RoomModel_1.Room.findOneAndUpdate({ $and: [{ _id: _id }, { adminID: adminID }] }, {
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
                    });
                    if (isUpdated) {
                        const UserPropertyCache = common_1.Cache.getCacheData(Constant_1.CacheKey.user.property(isUpdated.property));
                        if (ManagerRoomCache.data !== '') {
                            common_1.Cache.ClearCache(Constant_1.CacheKey.manager.room(isUser.data.email));
                        }
                        if (ManagerPropertyCache.data !== '') {
                            common_1.Cache.ClearCache(Constant_1.CacheKey.manager.property(isUser.data.email));
                        }
                        if (UserRoomCache.data !== '') {
                            common_1.Cache.ClearCache(Constant_1.CacheKey.user.room(_id));
                        }
                        if (UserPropertyCache.data !== '') {
                            common_1.Cache.ClearCache(Constant_1.CacheKey.user.property(isUpdated.property));
                        }
                        this.objUserResponse = (0, common_1.GetUserSuccessObj)(`Success: Your Room has been Updated `, common_1.HttpStatusCodes.CREATED);
                    }
                    else {
                        this.objUserResponse = (0, common_1.GetUserErrorObj)(`Server error not able to update Room `, common_1.HttpStatusCodes.BAD_REQUEST);
                    }
                }
                else {
                    this.objUserResponse = (0, common_1.GetUserErrorObj)(isUser.error, common_1.HttpStatusCodes.NOT_ACCEPTABLE);
                }
            }
            catch (error) {
                this.objUserResponse = (0, common_1.GetUserErrorObj)(error.message, common_1.HttpStatusCodes.BAD_GATEWAY);
            }
            finally {
                return this.objUserResponse;
            }
        });
        this.deleteRoom = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const { adminID, RoomID } = this.objParam.data;
                const isUser = yield (0, AdiminVerification_1.checkAdminVerification)(adminID);
                if (isUser.error === '') {
                    const ManagerRoomCache = common_1.Cache.getCacheData(Constant_1.CacheKey.manager.room(isUser.data.email));
                    const ManagerPropertyCache = common_1.Cache.getCacheData(Constant_1.CacheKey.manager.property(isUser.data.email));
                    const UserRoomCache = common_1.Cache.getCacheData(Constant_1.CacheKey.user.room(RoomID));
                    const isDeleted = yield RoomModel_1.Room.findOneAndDelete({ $and: [{ _id: RoomID }, { adminID: adminID }] });
                    if (isDeleted) {
                        const isPropertyUpdated = yield PropertyModel_1.Property.findOneAndUpdate({ _id: isDeleted.property }, {
                            $pull: {
                                rooms: isDeleted._id
                            }
                        });
                        if (isPropertyUpdated) {
                            const UserPropertyCache = common_1.Cache.getCacheData(Constant_1.CacheKey.user.property(isDeleted.property));
                            if (ManagerRoomCache.data !== '') {
                                common_1.Cache.ClearCache(Constant_1.CacheKey.manager.room(isUser.data.email));
                            }
                            if (ManagerPropertyCache.data !== '') {
                                common_1.Cache.ClearCache(Constant_1.CacheKey.manager.property(isUser.data.email));
                            }
                            if (UserRoomCache.data !== '') {
                                common_1.Cache.ClearCache(Constant_1.CacheKey.user.room(RoomID));
                            }
                            if (UserPropertyCache.data !== '') {
                                common_1.Cache.ClearCache(Constant_1.CacheKey.user.property(isDeleted.property));
                            }
                            this.objUserResponse = (0, common_1.GetUserSuccessObj)(`Success: Your Room has been deleted `, common_1.HttpStatusCodes.CREATED);
                        }
                        else {
                            this.objUserResponse = (0, common_1.GetUserErrorObj)('Server error: Not able to remove Room from property after deleting. ', common_1.HttpStatusCodes.BAD_REQUEST);
                        }
                    }
                    else {
                        this.objUserResponse = (0, common_1.GetUserErrorObj)('Server error: Not able to delete Room. ', common_1.HttpStatusCodes.BAD_REQUEST);
                    }
                }
                else {
                    this.objUserResponse = (0, common_1.GetUserErrorObj)(isUser.error, common_1.HttpStatusCodes.NOT_ACCEPTABLE);
                }
            }
            catch (error) {
                this.objUserResponse = (0, common_1.GetUserErrorObj)(error.message, common_1.HttpStatusCodes.BAD_GATEWAY);
            }
            finally {
                return this.objUserResponse;
            }
        });
        this.getRoomDetail = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const { guestID, roomID, PropertyID } = this.objParam.data;
                const isUser = yield (0, GuestVerification_1.checkGuestVerification)(guestID);
                if (isUser.error === '') {
                    const roomCache = common_1.Cache.getCacheData(Constant_1.CacheKey.user.room(roomID));
                    if (roomCache.error === '') {
                        this.objUserResponse = (0, common_1.GetUserSuccessObj)(roomCache.data, common_1.HttpStatusCodes.OK);
                    }
                    else {
                        const RoomDetail = yield RoomModel_1.Room.findOne({
                            $and: [
                                {
                                    _id: roomID
                                },
                                {
                                    property: PropertyID
                                }
                            ]
                        }).populate('property').exec();
                        if (RoomDetail) {
                            common_1.Cache.SetCache(Constant_1.CacheKey.user.room(roomID), RoomDetail);
                            this.objUserResponse = (0, common_1.GetUserSuccessObj)(RoomDetail, common_1.HttpStatusCodes.OK);
                        }
                        else {
                            this.objUserResponse = (0, common_1.GetUserErrorObj)('The Room you are looking for is not available', common_1.HttpStatusCodes.NOT_ACCEPTABLE);
                        }
                    }
                }
                else {
                    this.objUserResponse = (0, common_1.GetUserErrorObj)(isUser.error, common_1.HttpStatusCodes.NOT_ACCEPTABLE);
                }
            }
            catch (error) {
                this.objUserResponse = (0, common_1.GetUserErrorObj)(error.message, common_1.HttpStatusCodes.BAD_GATEWAY);
            }
            finally {
                return this.objUserResponse;
            }
        });
    }
}
