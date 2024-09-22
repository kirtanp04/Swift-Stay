import { NextFunction, Request, Response } from 'express';
import { Cache, GetUserErrorObj, GetUserSuccessObj, HttpStatusCodes, UserResponse } from '../common';
import { CacheKey, Param } from '../Constant';
import { checkAdminVerification } from '../middleware/AdiminVerification';
import { Job, JobClass } from '../models/JobModel';
import { Property } from '../models/PropertyModel';
import { TParam } from '../types/Type';

const _ManagerAddNewJob: string = Param.function.manager.Job.AddnewJob;
const _ManagerGetAllJob: string = Param.function.manager.Job.GetAllJobs;

export class JobFunction {
    private static objUserResponse: UserResponse = new UserResponse();

    static findFunction = async (objParam: TParam, req: Request, res: Response, next: NextFunction): Promise<UserResponse> => {
        let _Function = new Functions();
        _Function.req = req;
        _Function.res = res;
        _Function.next = next;
        _Function.objParam = objParam;

        switch (objParam.function) {
            case _ManagerAddNewJob:
                this.objUserResponse = await _Function.AddNewJob();
                break;

            case _ManagerGetAllJob:
                this.objUserResponse = await _Function.GetAllJobList();
                break;

            default:
                this.objUserResponse = GetUserErrorObj('Server error: Wronge Function.', HttpStatusCodes.BAD_REQUEST);
                break;
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

    public AddNewJob = async (): Promise<UserResponse> => {
        try {
            const objJob: JobClass = this.objParam!.data;

            const CheckAdmin = await checkAdminVerification(objJob.AdminID);

            if (CheckAdmin.error === '') {
                const CreateJob = await Job.create({
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

                const isUpdated = await Property.findOneAndUpdate(
                    { adminID: objJob.AdminID, _id: objJob.PropertyID },
                    {
                        $set: {
                            jobHiring: true,
                        },
                    }
                );

                if (isUpdated === undefined) {
                    this.objUserResponse = GetUserErrorObj(
                        'Server error: not able to update property after creating new Job',
                        HttpStatusCodes.NOT_ACCEPTABLE
                    );
                    await CreateJob.deleteOne({ _id: CreateJob._id });
                } else {
                    await CreateJob.save();
                    if (Cache.getCacheData(CacheKey.manager.JobList(objJob.AdminID)).error === '') {
                        Cache.ClearCache(CacheKey.manager.JobList(objJob.AdminID));
                    }

                    if (Cache.getCacheData(CacheKey.manager.property(CheckAdmin.data.email)).error === '') {
                        Cache.ClearCache(CacheKey.manager.property(CheckAdmin.data.email));
                    }

                    this.objUserResponse = GetUserSuccessObj('Successfully created new job', HttpStatusCodes.OK);
                }
            } else {
                this.objUserResponse = GetUserErrorObj(CheckAdmin.error, HttpStatusCodes.NOT_ACCEPTABLE);
            }
        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_REQUEST);
        } finally {
            return this.objUserResponse;
        }
    };

    public GetAllJobList = async (): Promise<UserResponse> => {
        try {
            const adminID = this.objParam!.data;

            const CheckAdmin = await checkAdminVerification(adminID);

            if (CheckAdmin.error === '') {
                const JobCache = Cache.getCacheData(CacheKey.manager.JobList(adminID));

                if (JobCache.error === '') {
                    this.objUserResponse = GetUserSuccessObj(JobCache.data, HttpStatusCodes.OK);
                } else {
                    const JobList = await Job.find({ AdminID: adminID });
                    Cache.SetCache(CacheKey.manager.JobList(adminID), JobList);
                    this.objUserResponse = GetUserSuccessObj(JobList, HttpStatusCodes.OK);
                }
            } else {
                this.objUserResponse = GetUserErrorObj(CheckAdmin.error, HttpStatusCodes.NOT_ACCEPTABLE);
            }
        } catch (error: any) {
            this.objUserResponse = GetUserErrorObj(error.message, HttpStatusCodes.BAD_REQUEST);
        } finally {
            return this.objUserResponse;
        }
    };
}
