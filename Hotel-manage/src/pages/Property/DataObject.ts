import { Api, getPostParamData } from "src/common/ApiCall";
import { RoomClass } from "../room/DataObject";
import { Param } from "src/Constant";
import { ProjectResponse } from "src/common/Response";

export enum enumPropertyType {
    Hotel = "Hotel",

    Resort = "Resort",

    Apartment = "Apartment",

    Bungalow = "Bungalow",
}

export class PropertyClass {
    _id: string = "";
    adminID: any = "";
    name: string = "";
    propertyType: enumPropertyType = enumPropertyType.Hotel;
    address: string = "";
    city: string = "";
    state: string = "";
    country: string = "";
    zipCode: string = "";
    phone: string = "";
    email: string = "";
    website: string = "";
    description: string = "";
    amenities: string[] = [];
    images: string[] = [];
    rooms: RoomClass[] = [];
    createdAt: Date = new Date();
}

export class PropertyApi {
    static addNewProperty = async (
        objProperty: PropertyClass,
        onsuccess: (res: any) => void,
        onFail: (err: any) => void
    ) => {
        try {
            const _Param = getPostParamData(
                Param.broker.manager.Property,
                Param.function.manager.Property.AddProperty
            );
            await Api.post(_Param, objProperty, (res: ProjectResponse) => {
                if (res.error === "") {
                    onsuccess(res.data);
                } else {
                    onFail(res.error);
                }
            });
        } catch (error: any) {
            onFail(error);
        }
    };
}
