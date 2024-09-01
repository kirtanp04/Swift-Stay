import { Api, getGETParamData } from 'src/common/ApiCall';
import { Property } from './Property'
import { Param } from 'src/Constant';
export enum enumRoomType {
    Single_Room = 'Single Room',
    Double_Room = 'Double Room',
    Triple_Room = 'Triple Room',
    King_Room = 'King Room',
    Executive_Room = 'Executive Room',
    Queen_Room = 'Queen Room',
    Juniour_Suites = 'Junior Suites'
}

export class Room {
    _id: string = '';
    adminID: string = '';
    property: Property = new Property()
    roomNumber: number = 0
    type: enumRoomType = enumRoomType.Single_Room // e.g., single, double, suite
    description: string = ''
    amenities: string[] = []
    images: string[] = []
    price: number = 0
    currency: string = ''
    maxOccupancy: number = 0
    isAvailable: boolean = true
    createdAt: Date = new Date()
    updatedAt: Date = new Date()


    static getRoomDetail = async (roomID: string, PropertyID: string, UserID: string, onsuccess: (objRoom: Room) => void, onfail: (err: any) => void) => {
        try {

            const _Param = getGETParamData(Param.broker.Room, Param.function.room.GetRoomDetail, { guestID: UserID, roomID: roomID, PropertyID: PropertyID })

            await Api.protectedGet(_Param, (res) => {
                if (res.error !== '') {
                    onfail(res.error)
                } else {
                    onsuccess(res.data)
                }
            })

        } catch (error: any) {
            onfail(error)
        }
    }
}