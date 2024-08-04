import { Api, getGETParamData } from 'src/common/ApiCall';
import { Room } from './Room'
import { Param } from 'src/Constant';

export enum enumPropertyType {
    Hotel = 'Hotel',
    Resort = 'Resort',
    Apartment = 'Apartment',
    Bungalow = 'Bungalow',
    Villa = 'Villa',
    Cottage = 'Cottage'
}

export class Property {
    _id: string = '';
    adminID: string = '';
    name: string = '';
    propertyType: enumPropertyType = enumPropertyType.Hotel;
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
    rooms: Room[] = [];
    // reviews: ReviewClass = new ReviewClass();
    // subscribers: SubscriberClass = new SubscriberClass();
    jobHiring: boolean = false
    createdAt: Date = new Date();
    updatedAt: Date = new Date();

    static GetPropertByCountry = async (country: string, onsuccess: (porpertyList: Property[]) => void, onfail: (err: any) => void) => {
        try {
            const _Param = getGETParamData(Param.broker.Property, Param.function.property.GetAllPropertyByCountry, { country: country })
            await Api.get(_Param, (res) => {

                if (res.error === '') {
                    onsuccess(res.data)
                } else {
                    onfail(res.error)
                }

            }, (progressValue) => {
                console.log(progressValue)
            })
        } catch (error: any) {
            onfail(error.message)
        }
    }


    static GetTotalPropertByCountry = async (country: string, onsuccess: (porpertyList: { state: string; totalProperties: number }[]) => void, onfail: (err: any) => void) => {
        try {
            const _Param = getGETParamData(Param.broker.Property, Param.function.property.GetTotalPropertByCountry, { country: country })
            await Api.get(_Param, (res) => {

                if (res.error === '') {
                    onsuccess(res.data)
                } else {
                    onfail(res.error)
                }

            }, (progressValue) => {
                console.log(progressValue)
            })
        } catch (error: any) {
            onfail(error.message)
        }
    }

    static GetTotalPropertByPropertyType = async (country: string, onsuccess: (porpertyList: { propertyType: string; totalProperties: number }[]) => void, onfail: (err: any) => void) => {
        try {
            const _Param = getGETParamData(Param.broker.Property, Param.function.property.GetTotalPropertyByType, { country: country })
            await Api.get(_Param, (res) => {

                if (res.error === '') {
                    onsuccess(res.data)
                } else {
                    onfail(res.error)
                }

            }, (progressValue) => {
                console.log(progressValue)
            })
        } catch (error: any) {
            onfail(error.message)
        }
    }


    static GetPropertyListByFilterSearch = async (pObjFilter: any, onsuccess: (porpertyList: any) => void, onfail: (err: any) => void) => {
        try {
            const _Param = getGETParamData(Param.broker.Property, Param.function.property.GetPropertyListByFilterSearch, { FilterData: pObjFilter })
            await Api.get(_Param, (res) => {

                if (res.error === '') {
                    onsuccess(res.data)
                } else {
                    onfail(res.error)
                }

            }, (progressValue) => {
                console.log(progressValue)
            })
        } catch (error: any) {
            onfail(error.message)
        }
    }
}