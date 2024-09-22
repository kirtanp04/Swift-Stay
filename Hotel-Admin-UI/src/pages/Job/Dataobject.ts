import { Api, getGETParamData, getPostParamData } from "src/common/ApiCall";
import { isUndefinedOrNull } from "src/common/common";
import { ProjectResponse } from "src/common/Response";
import { Param } from "src/Constant";
import { StoreError } from "src/util/StoreError";

export enum enumJobStatus {
    OPEN = "open",
    CLOSED = "closed",
    PENDING = "pending",
}

export enum enumJobType {
    FULL_TIME = "full-time",
    PART_TIME = "part-time",
    CONTRACT = "contract",
}

export enum enumJobCategory {
    MANAGEMENT = "management",
    CLEANING = "cleaning",
    ROOM_SERVICE = "room-service",
    MAINTENANCE = "maintenance",
    ADMINISTRATION = "administration",
    SECURITY = "security",
    OTHER = "other",
}

export enum enumJobExperience {
    NoExpe = "No Experience",
    AtLeastSixMonth = " Atleast 6 months",
    OneYear = "1 year",
    OneAndhalf = "1.5 year",
    TwoToFour = "2 to 4 year",
    More = "More than 4 years"
}

export class Job {
    _id: string = "";

    PropertyID: string = "";

    PropertyName: string = ""

    AdminID: string = "";

    title: string = "";

    description: string = "";

    location: string = "";

    salary: number = 0;

    currency: string = "";

    JobType: enumJobType = enumJobType.FULL_TIME;

    category: enumJobCategory = enumJobCategory.OTHER;

    status: enumJobStatus = enumJobStatus.OPEN;

    createdAt: Date = new Date();

    updatedAt: Date = new Date();

    requirements: string[] = []; // List of skills or qualifications

    experience: enumJobExperience = enumJobExperience.AtLeastSixMonth; // Experience level required, e.g. '2+ years'

    benefits: string[] = []; // List of benefits, e.g. ['Health insurance', 'Paid time off']

    customInfo: { label: string; value: string }[] = [];

    static getCopy(objJob: any): Job {
        let _newObjJob: any = new Job();
        try {
            for (const key in _newObjJob) {
                _newObjJob[key] = isUndefinedOrNull(objJob[key], _newObjJob[key]);
            }
        } catch (error) {
            _newObjJob = new Job();
        } finally {
            return _newObjJob;
        }
    }

    static AddNewJob = async (objJob: Job, onSuccess: (res: any) => void, onFail: (err: any) => void) => {
        try {
            const _Param = getPostParamData(
                Param.broker.manager.Job,
                Param.function.manager.Job.AddnewJob
            );

            await Api.protectedPost(_Param, objJob, (res: ProjectResponse) => {
                if (res.error === "") {
                    onSuccess(res.data);
                } else {
                    StoreError("Adding Job", res.error);
                    onFail(res.error);
                }
            });

        } catch (error: any) {
            onFail(error.message)
        }
    }


    static GetJobList = async (
        adminID: string,
        onsuccess: (res: any) => void,
        onFail: (err: any) => void,
        onProgress?: (progressValue: number) => void
    ) => {
        try {
            const _Param = getGETParamData(
                Param.broker.manager.Job,
                Param.function.manager.Job.GetAllJobs,
                adminID
            );

            await Api.protectedGet(
                _Param,
                (res) => {
                    if (res.error === "") {
                        onsuccess(res.data);
                    } else {
                        StoreError("Getting All Jobs", res.error);
                        onFail(res.error);
                    }
                },
                (progressValue) => {
                    if (onProgress !== undefined) {
                        onProgress(progressValue);
                    }
                }
            );
        } catch (error: any) {
            StoreError("Getting All Property", error.message);
            onFail(error.message);
        }
    }
}
