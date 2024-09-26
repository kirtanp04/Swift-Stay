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
exports.JobFunction = void 0;
const common_1 = require("../common");
const Constant_1 = require("../Constant");
const AdiminVerification_1 = require("../middleware/AdiminVerification");
const JobModel_1 = require("../models/JobModel");
const PropertyModel_1 = require("../models/PropertyModel");
const Type_1 = require("../types/Type");
const _ManagerAddNewJob = Constant_1.Param.function.manager.Job.AddnewJob;
const _ManagerGetAllJob = Constant_1.Param.function.manager.Job.GetAllJobs;
const _GuestGetAllJobByProperty = Constant_1.Param.function.guest.job.GetAllJobByProperty;
const _GuestGetJobDetail = Constant_1.Param.function.guest.job.GetJobDetail;
class JobFunction {
}
exports.JobFunction = JobFunction;
_a = JobFunction;
JobFunction.objUserResponse = new common_1.UserResponse();
JobFunction.findFunction = (objParam, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let _Function = new Functions();
    _Function.req = req;
    _Function.res = res;
    _Function.next = next;
    _Function.objParam = objParam;
    switch (objParam.function) {
        case _ManagerAddNewJob:
            _a.objUserResponse = yield _Function.AddNewJob();
            break;
        case _ManagerGetAllJob:
            _a.objUserResponse = yield _Function.GetAllJobList();
            break;
        case _GuestGetAllJobByProperty:
            _a.objUserResponse = yield _Function.GetAllJobByProperty();
            break;
        case _GuestGetJobDetail:
            _a.objUserResponse = yield _Function.GetJobDetail();
            break;
        default:
            _a.objUserResponse = (0, common_1.GetUserErrorObj)('Server error: Wronge Function.', common_1.HttpStatusCodes.BAD_REQUEST);
            break;
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
        this.AddNewJob = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const objJob = this.objParam.data;
                const CheckAdmin = yield (0, AdiminVerification_1.checkAdminVerification)(objJob.AdminID);
                if (CheckAdmin.error === '') {
                    const CreateJob = yield JobModel_1.Job.create({
                        AdminID: objJob.AdminID,
                        JobType: objJob.JobType,
                        PropertyID: objJob.PropertyID,
                        PropertyName: objJob.PropertyName,
                        benefits: objJob.benefits,
                        category: objJob.category,
                        createdAt: objJob.createdAt,
                        currency: objJob.currency,
                        customInfo: objJob.customInfo,
                        description: objJob.description,
                        experience: objJob.experience,
                        location: objJob.location,
                        requirements: objJob.requirements,
                        salary: objJob.salary,
                        status: objJob.status,
                        title: objJob.title,
                        updatedAt: objJob.updatedAt,
                    });
                    const isUpdated = yield PropertyModel_1.Property.findOneAndUpdate({ adminID: objJob.AdminID, _id: objJob.PropertyID }, {
                        $set: {
                            jobHiring: true,
                        },
                    });
                    if (isUpdated === undefined) {
                        this.objUserResponse = (0, common_1.GetUserErrorObj)('Server error: not able to update property after creating new Job', common_1.HttpStatusCodes.NOT_ACCEPTABLE);
                        yield CreateJob.deleteOne({ _id: CreateJob._id });
                    }
                    else {
                        yield CreateJob.save();
                        if (common_1.Cache.getCacheData(Constant_1.CacheKey.manager.JobList(objJob.AdminID)).error === '') {
                            common_1.Cache.ClearCache(Constant_1.CacheKey.manager.JobList(objJob.AdminID));
                        }
                        if (common_1.Cache.getCacheData(Constant_1.CacheKey.job.JobsByProperty(objJob.PropertyID)).error === '') {
                            common_1.Cache.ClearCache(Constant_1.CacheKey.job.JobsByProperty(objJob.PropertyID));
                        }
                        if (common_1.Cache.getCacheData(Constant_1.CacheKey.manager.property(CheckAdmin.data.email)).error === '') {
                            common_1.Cache.ClearCache(Constant_1.CacheKey.manager.property(CheckAdmin.data.email));
                        }
                        this.objUserResponse = (0, common_1.GetUserSuccessObj)('Successfully created new job', common_1.HttpStatusCodes.OK);
                    }
                }
                else {
                    this.objUserResponse = (0, common_1.GetUserErrorObj)(CheckAdmin.error, common_1.HttpStatusCodes.NOT_ACCEPTABLE);
                }
            }
            catch (error) {
                this.objUserResponse = (0, common_1.GetUserErrorObj)(error.message, common_1.HttpStatusCodes.BAD_REQUEST);
            }
            finally {
                return this.objUserResponse;
            }
        });
        this.GetAllJobList = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const adminID = this.objParam.data;
                const CheckAdmin = yield (0, AdiminVerification_1.checkAdminVerification)(adminID);
                if (CheckAdmin.error === '') {
                    const JobCache = common_1.Cache.getCacheData(Constant_1.CacheKey.manager.JobList(adminID));
                    if (JobCache.error === '') {
                        this.objUserResponse = (0, common_1.GetUserSuccessObj)(JobCache.data, common_1.HttpStatusCodes.OK);
                    }
                    else {
                        const JobList = yield JobModel_1.Job.find({ AdminID: adminID });
                        common_1.Cache.SetCache(Constant_1.CacheKey.manager.JobList(adminID), JobList);
                        this.objUserResponse = (0, common_1.GetUserSuccessObj)(JobList, common_1.HttpStatusCodes.OK);
                    }
                }
                else {
                    this.objUserResponse = (0, common_1.GetUserErrorObj)(CheckAdmin.error, common_1.HttpStatusCodes.NOT_ACCEPTABLE);
                }
            }
            catch (error) {
                this.objUserResponse = (0, common_1.GetUserErrorObj)(error.message, common_1.HttpStatusCodes.BAD_REQUEST);
            }
            finally {
                return this.objUserResponse;
            }
        });
        this.GetAllJobByProperty = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const { propertyID } = this.objParam.data;
                const cacheData = common_1.Cache.getCacheData(Constant_1.CacheKey.job.JobsByProperty(propertyID));
                if (cacheData.error === '') {
                    this.objUserResponse = (0, common_1.GetUserSuccessObj)(cacheData.data, common_1.HttpStatusCodes.OK);
                }
                else {
                    const Jobs = yield JobModel_1.Job.aggregate([
                        {
                            $match: {
                                $and: [
                                    {
                                        PropertyID: propertyID
                                    }
                                ]
                            }
                        }
                    ]);
                    common_1.Cache.SetCache(Constant_1.CacheKey.job.JobsByProperty(propertyID), Jobs);
                    this.objUserResponse = (0, common_1.GetUserSuccessObj)(Jobs, common_1.HttpStatusCodes.OK);
                }
            }
            catch (error) {
                this.objUserResponse = (0, common_1.GetUserErrorObj)(error.message, common_1.HttpStatusCodes.BAD_REQUEST);
            }
            finally {
                return this.objUserResponse;
            }
        });
        this.GetJobDetail = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const { propertyID, jobID } = this.objParam.data;
                const cacheData = common_1.Cache.getCacheData(Constant_1.CacheKey.job.JobDetail(jobID));
                if (cacheData.error === '') {
                    this.objUserResponse = (0, common_1.GetUserSuccessObj)(cacheData.data, common_1.HttpStatusCodes.OK);
                }
                else {
                    const jobDetail = yield JobModel_1.Job.findOne({
                        $and: [{
                                _id: jobID
                            }, {
                                PropertyID: propertyID
                            }]
                    });
                    if (jobDetail !== null) {
                        common_1.Cache.SetCache(Constant_1.CacheKey.job.JobDetail(jobID), jobDetail);
                        this.objUserResponse = (0, common_1.GetUserSuccessObj)(jobDetail, common_1.HttpStatusCodes.OK);
                    }
                    else {
                        this.objUserResponse = (0, common_1.GetUserErrorObj)("Server error: invalid payload or url, no such job available", common_1.HttpStatusCodes.BAD_REQUEST);
                    }
                }
            }
            catch (error) {
                this.objUserResponse = (0, common_1.GetUserErrorObj)(error.message, common_1.HttpStatusCodes.BAD_REQUEST);
            }
            finally {
                return this.objUserResponse;
            }
        });
    }
}
