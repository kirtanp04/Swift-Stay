import { Api, getGETParamData } from "src/common/ApiCall";
import { isUndefinedOrNull } from "src/common/common";
import { Param } from "src/Constant";

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
    More = "More than 4 years",
}

export class Job {
    _id: string = "";

    PropertyID: string = "";

    PropertyName: string = "Lakeview-Villas";

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

    static GetJobsByPropertyID = async (
        propertyID: string,

        onsuccess: (res: any) => void,
        onfail: (err: string) => void
    ) => {
        try {
            const _Param = getGETParamData(
                Param.broker.Job,
                Param.function.job.GetAllJobByProperty,
                { propertyID: propertyID }
            );

            await Api.get(_Param, (res) => {
                if (res.error !== "") {
                    onfail(res.error);
                } else {
                    onsuccess(res.data);
                }
            });
        } catch (error: any) {
            onfail(error);
        }
    };


    static GetJobDetail = async (
        propertyID: string,
        jobID: string,
        onsuccess: (res: any) => void,
        onfail: (err: string) => void
    ) => {
        try {
            const _Param = getGETParamData(
                Param.broker.Job,
                Param.function.job.GetJobDetail,
                { propertyID: propertyID, jobID: jobID }
            );

            await Api.get(_Param, (res) => {
                if (res.error !== "") {
                    onfail(res.error);
                } else {
                    onsuccess(res.data);
                }
            });
        } catch (error: any) {
            onfail(error);
        }
    };
}
