"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewFunction = void 0;
const common_1 = require("../common");
const Type_1 = require("../types/Type");
const Constant_1 = require("../Constant");
const AdiminVerification_1 = require("../middleware/AdiminVerification");
const Review_1 = require("../models/Review");
const _ManagerGetAllReviewsByAdmin = Constant_1.Param.function.manager.review.GetAllReviewsByAdmin;
class ReviewFunction {
}
exports.ReviewFunction = ReviewFunction;
_a = ReviewFunction;
ReviewFunction.objUserResponse = new common_1.UserResponse();
ReviewFunction.findFunction = (objParam, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let _Function = new Functions();
    _Function.req = req;
    _Function.res = res;
    _Function.next = next;
    _Function.objParam = objParam;
    if (objParam.function === _ManagerGetAllReviewsByAdmin) {
        const _res = yield _Function.getAllReviewbyAdmin();
        _a.objUserResponse = _res;
    }
    else {
        _a.objUserResponse = (0, common_1.GetUserErrorObj)('Server error: Wronge Function.', common_1.HttpStatusCodes.BAD_REQUEST);
    }
    return _a.objUserResponse;
});
class Functions {
    constructor() {
        this.objUserResponse = new common_1.UserResponse();
        this.req = null;
        this.res = null;
        this.next = null;
        this.objParam = new Type_1.TParam();
        this.getAllReviewbyAdmin = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const { adminID } = this.objParam.data;
                const checkUser = yield (0, AdiminVerification_1.checkAdminVerification)(adminID);
                if (checkUser.error === '') {
                    const ManagerReviewCache = common_1.Cache.getCacheData(Constant_1.CacheKey.manager.review(checkUser.data.email));
                    if (ManagerReviewCache.error === '') {
                        this.objUserResponse = (0, common_1.GetUserSuccessObj)(ManagerReviewCache.data, common_1.HttpStatusCodes.OK);
                    }
                    else {
                        // const allProperties: PropertyClass[] = await PropertyModel.find({ adminID: checkUser.data._id })
                        const ReviewList = yield Review_1.Review.aggregate([
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
                        ]);
                        if (ReviewList.length > 0) {
                            common_1.Cache.SetCache(Constant_1.CacheKey.manager.review(checkUser.data.email), ReviewList);
                            this.objUserResponse = (0, common_1.GetUserSuccessObj)(ReviewList, common_1.HttpStatusCodes.OK);
                        }
                        else {
                            this.objUserResponse = (0, common_1.GetUserSuccessObj)([], common_1.HttpStatusCodes.OK);
                        }
                    }
                }
                else {
                    this.objUserResponse = (0, common_1.GetUserErrorObj)(checkUser.error, common_1.HttpStatusCodes.NOT_ACCEPTABLE);
                }
            }
            catch (error) {
                this.objUserResponse = (0, common_1.GetUserErrorObj)(error.message, common_1.HttpStatusCodes.BAD_GATEWAY);
            }
            finally {
                return this.objUserResponse;
            }
        });
    }
}
