import { enumPropertyType } from "src/ObjMgr/Property"


export class FilterClass {
    Price: number | undefined = undefined

    city: string[] = []

    propertyType: enumPropertyType[] = []

    reviewScore: number | null = null


    static getFilterObj = (objFilter: FilterClass) => {
        try {

            let NewfilterObj: any

            NewfilterObj['Price'] = objFilter.Price

            if (objFilter.propertyType.length > 0) {
                objFilter.propertyType.forEach((type) => {
                    NewfilterObj['propertyType'].push(type)
                })
            }

            return NewfilterObj

        } catch (error: any) {

        }
    }
}