export enum enumPropertyType {
    Hotel = 'Hotel',

    Resort = 'Resort',

    Apartment = 'Apartment',

    Bungalow = 'Bungalow'
}

export class PropertyClass {
    _id: string = '';
    adminID: any = '';
    name: string = '';
    propertyType: enumPropertyType = enumPropertyType.Hotel
    address: string = '';
    city: string = '';
    state: string = '';
    country: string = '';
    zipCode: string = '';
    phone: string = '';
    email: string = '';
    website: string = '';
    description: string = '';
    amenities: string[] = [];
    images: string[] = [];
    createdAt: Date = new Date();
}