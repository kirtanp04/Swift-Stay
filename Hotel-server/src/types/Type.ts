import { enumPropertyType } from "../models/PropertyModel";
import { enumRoomType } from "../models/RoomModel";

export class TParam {
    Broker: string = ''

    function: string = ''

    data: any
}

export class ChatObj {
    message: string = "";
    date: Date | string = new Date();
    key: string = "";
    senderDetail: Sender = new Sender();
}

class Sender {
    _id: string = "";
    email: string = "";
    name: string = "";
    profileImg: string = "";
    role: string = ''
}

export interface TSuccessbooking {
    propertyName: string
    description: string,
    image: string[],
    totalPrice: string,
    propertyType: enumPropertyType,
    checkIn: string,
    checkOut: string,
    totalNights: string,
    roomType: enumRoomType,
    roomDescription: string,
    roomPrice: string
}