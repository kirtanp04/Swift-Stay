import { Api, getGETParamData, getPostParamData } from "src/common/ApiCall";
import { PropertyClass } from "../Property/DataObject";
import { Param } from "src/Constant";
import { StoreError } from "src/util/StoreError";
import { isUndefinedOrNull } from "src/common/common";

export enum enumRoomType {
    Single_Room = 'Single Room',
    Double_Room = 'Double Room',
    Triple_Room = 'Triple Room',
    King_Room = 'King Room',
    Executive_Room = 'Executive Room',
    Queen_Room = 'Queen Room',
    Juniour_Suites = 'Junior Suites'
}

export class RoomClass {
    _id: string = '';
    adminID: string = '';
    property: PropertyClass = new PropertyClass()
    roomNumber: number = 0
    type: enumRoomType = enumRoomType.Single_Room // e.g., single, double, suite
    description: string = ''
    amenities: string[] = []
    images: string[] = []
    price: number = 0
    maxOccupancy: number = 0
    rating: number = 0
    isAvailable: boolean = true
    createdAt: Date = new Date()
    updatedAt: Date = new Date()

    static getCopy(ObjRoom: any): RoomClass {
        let _newObjRoom: any = new RoomClass();
        try {
            for (const key in _newObjRoom) {
                _newObjRoom[key] = isUndefinedOrNull(ObjRoom[key], _newObjRoom[key]);
            }
        } catch (error) {
            _newObjRoom = new RoomClass();
        } finally {
            return _newObjRoom;
        }
    }
}

export class RoomApi {

    static addNewRoom = async (objRoom: RoomClass, onsuccess: (res: any) => void,
        onFail: (err: any) => void,) => {
        const _Param = getPostParamData(Param.broker.manager.Room, Param.function.manager.Room.AddRoom)

        await Api.protectedPost(_Param, objRoom, (res) => {
            if (res.error === "") {
                onsuccess(res.data);
            } else {
                StoreError('Creating New Room', res.error)
                onFail(res.error);
            }
        })
    }

    static updatedRoom = async (objRoom: RoomClass, onsuccess: (res: any) => void,
        onFail: (err: any) => void,) => {
        const _Param = getPostParamData(Param.broker.manager.Room, Param.function.manager.Room.UpdateRoom)

        await Api.protectedPost(_Param, objRoom, (res) => {
            if (res.error === "") {
                onsuccess(res.data);
            } else {
                StoreError('Creating New Room', res.error)
                onFail(res.error);
            }
        })
    }

    static getAllRooms = async (adminID: string, onsuccess: (res: any) => void,
        onFail: (err: any) => void,) => {
        const _Param = getGETParamData(Param.broker.manager.Room, Param.function.manager.Room.GetAllRoom, adminID)

        await Api.protectedGet(_Param, (res) => {
            if (res.error === "") {
                onsuccess(res.data);
            } else {
                StoreError('Getting all Room', res.error)
                onFail(res.error);
            }
        })
    }

    static deleteRoom = async (adminID: string, RoomID: string, onsuccess: (res: any) => void,
        onFail: (err: any) => void,) => {
        const _Param = getGETParamData(Param.broker.manager.Room, Param.function.manager.Room.DeleteRoom, { adminID: adminID, RoomID: RoomID })

        await Api.protectedGet(_Param, (res) => {
            if (res.error === "") {
                onsuccess(res.data);
            } else {
                StoreError('Getting all Room', res.error)
                onFail(res.error);
            }
        })
    }
}