import { Property } from './Property'
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
    maxOccupancy: number = 0
    isAvailable: boolean = true
    createdAt: Date = new Date()
    updatedAt: Date = new Date()
}