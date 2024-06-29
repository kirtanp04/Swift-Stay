import { PropertyClass } from "../Property/DataObject";

export class RoomClass {
    _id: string = '';
    property: PropertyClass = new PropertyClass()
    roomNumber: string = ''
    type: string = '' // e.g., single, double, suite
    description: string = ''
    amenities: string[] = []
    price: number = 0
    maxOccupancy: number = 0
    isAvailable: boolean = true
    createdAt: Date = new Date()
}