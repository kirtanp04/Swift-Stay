import { NextFunction, Request, Response } from "express";
import { Cache, GetUserErrorObj, GetUserSuccessObj, HttpStatusCodes, UserResponse } from "../common";
import { TParam } from "../types/Type";
import { CacheKey, Param } from "../Constant";
import { checkAdminVerification } from "../middleware/AdiminVerification";
import { Review } from "../models/Review";

const _ManagerGetAllReviewsByAdmin = Param.function.manager.review.GetAllReviewsByAdmin;
export class ReviewFunction {
    private static objUserResponse: UserResponse = new UserResponse();


    static findFunction = async (objParam: TParam, req: Request, res: Response, next: NextFunction): Promise<UserResponse> => {
        let _Function = new Functions();
        _Function.req = req;
        _Function.res = res;
        _Function.next = next;
        _Function.objParam = objParam;

        if (objParam.function === _ManagerGetAllReviewsByAdmin) {
            const _res = await _Function.getAllReviewbyAdmin();
            this.objUserResponse = _res;
        } else {
            this.objUserResponse = GetUserErrorObj('Server error: Wronge Function.', HttpStatusCodes.BAD_REQUEST);
        }

        return this.objUserResponse;
    };
}

class Functions {
    private objUserResponse: UserResponse = new UserResponse();

    public req: Request | null = null;

    public res: Response | null = null;

    public next: NextFunction | null = null;

    public objParam: TParam = new TParam();


    public getAllReviewbyAdmin = async (): Promise<UserResponse> => {
        try {
            const { adminID } = this.objParam.data;

            const checkUser = await checkAdminVerification(adminID);
            if (checkUser.error === '') {
                const ManagerReviewCache = Cache.getCacheData(CacheKey.manager.review(checkUser.data.email));

                if (ManagerReviewCache.error === '') {
                    this.objUserResponse = GetUserSuccessObj(ManagerReviewCache.data, HttpStatusCodes.OK);
                } else {
                    // const allProperties: PropertyClass[] = await PropertyModel.find({ adminID: checkUser.data._id })

                    const ReviewList = await Review.aggregate([
                        {
                            $lookup: {
                                from: 'properties',
                                let: { propertyId: '$property' },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $and: [
                                                    { $eq: ['$_id', '$$propertyId'] },
                                                    { $eq: ['$adminID', adminID] }
                                                ]
                                            }
                                        }
                                    }
                                ],
                                as: 'Property'
                            }
                        },
                        {
                            $addFields: {
                                avgRating: {
                                    $avg: {
                                        $map: {
                                            input: {
                                                $cond: {
                                                    if: { $isArray: '$reviewInfo' },
                                                    then: '$reviewInfo',
                                                    else: []
                                                }
                                            },
                                            as: 'rating',
                                            in: '$$rating.rating',
                                        },
                                    },
                                },
                            },
                        },
                        {
                            $unwind: '$Property'
                        },
                        {
                            $project: {
                                _id: 1,
                                reviewInfo: 1,
                                'Property._id': 1,
                                'Property.name': 1,
                                avgRating: 1,
                            }
                        }
                    ])

                    if (ReviewList.length > 0) {
                        Cache.SetCache(CacheKey.manager.review(checkUser.data.email), ReviewList);
                        this.objUserResponse = GetUserSuccessObj(ReviewList, HttpStatusCodes.OK);
                    } else {
                        this.objUserResponse = GetUserSuccessObj([], HttpStatusCodes.OK);
                    }

                }
            } else {
                this.objUserResponse = GetUserErrorObj(checkUser.error, HttpStatusCodes.NOT_ACCEPTABLE);
            }

        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_GATEWAY);
        } finally {
            return this.objUserResponse;
        }
    };
}