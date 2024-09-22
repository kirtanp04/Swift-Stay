

import { Api, getGETParamData } from "src/common/ApiCall";
import { Property } from "./Property";
import { Param } from "src/Constant";


export class HomePageData {
    TrendingDestinations: Property[] = [];
    TotalPropertByCountryState: { state: string; totalProperties: number }[] = [];
    TotalPropertByPropertyType: {
        propertyType: string;
        totalProperties: number;
    }[] = [];

    static GetHomePagePropertyData = async (country: string, onSuccess: (res: any) => void, onFail: (err: any) => void) => {
        try {
            const _Param = getGETParamData(Param.broker.Property, Param.function.property.GetHomePagePropertyData, { country: country })
            await Api.get(_Param, (res) => {
                if (res.error === '') {
                    onSuccess(res.data)
                } else {
                    onFail(res.error)
                }

            })
        } catch (error: any) {
            onFail(error.message)
        }
    }
}
