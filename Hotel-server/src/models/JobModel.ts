import mongoose, { Schema } from "mongoose";


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

export class JobClass {
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


}


const JobSchema = new Schema<JobClass>({

    AdminID: { type: String, required: [true, 'Admin is required.'] },
    PropertyID: { type: String, required: [true, 'Property is required.'] },
    PropertyName: { type: String, required: [true, 'Property name is required.'] },
    title: { type: String, required: [true, 'Job title is required.'] },
    description: { type: String, required: [true, 'Job description is required.'] },
    location: { type: String, required: [true, 'Job location is required.'] },
    salary: { type: Number, required: [true, 'Salary is required.'] },
    currency: { type: String, required: [true, 'currency is required.'] },
    JobType: { type: String, enum: Object.values(enumJobType), required: [true, 'JobType is required.'], default: enumJobType.FULL_TIME },
    category: { type: String, enum: Object.values(enumJobCategory), required: [true, 'Job category is required.'], default: enumJobCategory.OTHER },
    status: { type: String, enum: Object.values(enumJobStatus), required: [true, 'Job status is required.'], default: enumJobStatus.OPEN },
    experience: { type: String, enum: Object.values(enumJobExperience), required: [true, 'Job status is required.'], default: enumJobExperience.AtLeastSixMonth },
    requirements: [{ type: String }],
    benefits: [{ type: String }],
    customInfo: [{
        label: {
            type: String,
            required: [true, 'label is required']
        },
        value: {
            type: String,
            required: [true, 'label value is required']
        },
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }


});

JobSchema.index({ AdminID: 1 })

export const Job = mongoose.model<JobClass>('Jobs', JobSchema);