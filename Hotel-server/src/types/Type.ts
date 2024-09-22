import { BookingClass, PaymentStatus } from "src/models/BookingModel";
import { enumPropertyType, PropertyClass } from "../models/PropertyModel";
import { enumRoomType, RoomClass } from "../models/RoomModel";

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




export class Invoice {

    InvoiceId: string = ''

    CustomerInfo: InvoiceCustomer = new InvoiceCustomer()

    BookingDetails: InvoiceBooking = new InvoiceBooking()

    PaymentInfo: InvoicePayment = new InvoicePayment()

    PropertyInfo: InvoiceProperty = new InvoiceProperty()

    RoomInfo: InvoiceRoom = new InvoiceRoom()

    CreatedAt: Date = new Date()

}

class InvoiceCustomer {
    Name: string = ''

    Email: string = ''

    Number: number = 0

    Address: string = ''

    City: string = ''

    State: string = ''

    Country: string = ''
}

class InvoiceBooking {
    CheckIn: string = ''

    CheckOut: string = ''

    Adults: number = 0

    Childrens: number = 0

    TotalStay: string = ''

    TotalPay: string = ''

    currency: string = ''
}
class InvoicePayment {

    PaymentID: string = ''

    EmailID: string = ''

    HolderName: string = ''

    PaymentStatus: PaymentStatus | null = null

    PaymentType: string = ''

    PaymentDate: string = ''

    TotalPay: number = 0

    Currency: string = ''

    Country: string = ''
}

class InvoiceProperty {
    PropertyName: string = ''

    PropertyType: enumPropertyType | null = null

    PropertyAddress: string = ''

    PropertyCity: string = ''

    PropertyState: string = ''

    PropertyCountry: string = ''
}

class InvoiceRoom {
    RoomType: enumRoomType | null = null

    RoomPrice: number = 0

    currency: string = ''

    RoomNo: number = 0
}


export interface TSuccessbooking {
    objBooking: BookingClass,
    objRoom: RoomClass
}

export interface BookingListObj extends BookingClass {
    property: PropertyClass | null

    room: RoomClass | null
}


// ------------------------------- guest hompage data

export class THomePageData {
    TrendingDestinations: PropertyClass[] = [];
    TotalPropertByCountryState: { state: string; totalProperties: number }[] = [];
    TotalPropertByPropertyType: {
        propertyType: string;
        totalProperties: number;
    }[] = [];
}




// -------------------------------- Analytic

export class Analytic {
    TotalBookings: number = 0
    TotalRevenue: string = ''
    BookingAnalytics: TBookingAnalytics[] = []
    RevenueAnalytics: TRevenueAnalytics[] = []
    TopPropertiesByBooking: TToppropertyByBooking[] = []
    TotalPropertyandRooms: TTotalpropertyAndRoom = {
        property: 0,
        room: 0
    }
    AllPropertyWithAvgReview: TAllPropertyWithAvgReview[] = []
}







export interface TTotalpropertyAndRoom {
    property: number
    room: number
}
export interface TAllPropertyWithAvgReview {
    propertyName: string
    AvgReview: number
}

export interface TBookingAnalytics {
    bookingCount: number
    year: number
    monthName: string
    currency: string
}

export interface TRevenueAnalytics {
    totalPaySum: number
    year: number
    currency: string
    monthName: string
}



export interface TToppropertyByBooking {
    count: number
    name: string
}