import { Api, getGETParamData } from "src/common/ApiCall"
import { _Register } from "../Authentication/AuthMgr"
import { PropertyClass } from "../Property/DataObject"
import { Param } from "src/Constant"
import { StoreError } from "src/util/StoreError"


export class ReviewInfo {
    user: _Register = new _Register()
    message: string = ''
    rating: number = 0
    createAt: Date = new Date()
}

export class ReviewClass {
    _id: string = ''
    property: PropertyClass = new PropertyClass()
    reviewInfo: ReviewInfo[] = []
}


export interface TReviewApiRes {
    _id: string,
    reviewInfo: ReviewInfo[],
    Property: {
        _id: string,
        name: string
    }

    avgRating: number,
}




export class ReviewApi {
    static getReviewListbyAdmin = async (adminID: string,
        onsuccess: (res: any) => void,
        onFail: (err: any) => void,) => {
        try {
            const _Param = getGETParamData(
                Param.broker.manager.review,
                Param.function.manager.review.GetAllReviewsByAdmin,
                { adminID: adminID }
            );

            await Api.protectedGet(
                _Param,
                (res) => {
                    if (res.error === "") {
                        onsuccess(res.data);
                    } else {
                        StoreError("Getting All Review", res.error);
                        onFail(res.error);
                    }
                },

            );
        } catch (error: any) {
            StoreError("Getting All Review", error.message);
            onFail(error.message);
        }
    }
}
