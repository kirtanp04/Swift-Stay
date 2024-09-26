"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Job = exports.JobClass = exports.enumJobExperience = exports.enumJobCategory = exports.enumJobType = exports.enumJobStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var enumJobStatus;
(function (enumJobStatus) {
    enumJobStatus["OPEN"] = "open";
    enumJobStatus["CLOSED"] = "closed";
    enumJobStatus["PENDING"] = "pending";
})(enumJobStatus || (exports.enumJobStatus = enumJobStatus = {}));
var enumJobType;
(function (enumJobType) {
    enumJobType["FULL_TIME"] = "full-time";
    enumJobType["PART_TIME"] = "part-time";
    enumJobType["CONTRACT"] = "contract";
})(enumJobType || (exports.enumJobType = enumJobType = {}));
var enumJobCategory;
(function (enumJobCategory) {
    enumJobCategory["MANAGEMENT"] = "management";
    enumJobCategory["CLEANING"] = "cleaning";
    enumJobCategory["ROOM_SERVICE"] = "room-service";
    enumJobCategory["MAINTENANCE"] = "maintenance";
    enumJobCategory["ADMINISTRATION"] = "administration";
    enumJobCategory["SECURITY"] = "security";
    enumJobCategory["OTHER"] = "other";
})(enumJobCategory || (exports.enumJobCategory = enumJobCategory = {}));
var enumJobExperience;
(function (enumJobExperience) {
    enumJobExperience["NoExpe"] = "No Experience";
    enumJobExperience["AtLeastSixMonth"] = " Atleast 6 months";
    enumJobExperience["OneYear"] = "1 year";
    enumJobExperience["OneAndhalf"] = "1.5 year";
    enumJobExperience["TwoToFour"] = "2 to 4 year";
    enumJobExperience["More"] = "More than 4 years";
})(enumJobExperience || (exports.enumJobExperience = enumJobExperience = {}));
class JobClass {
    constructor() {
        this._id = "";
        this.PropertyID = "";
        this.PropertyName = "";
        this.AdminID = "";
        this.title = "";
        this.description = "";
        this.location = "";
        this.salary = 0;
        this.currency = "";
        this.JobType = enumJobType.FULL_TIME;
        this.category = enumJobCategory.OTHER;
        this.status = enumJobStatus.OPEN;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.requirements = []; // List of skills or qualifications
        this.experience = enumJobExperience.AtLeastSixMonth; // Experience level required, e.g. '2+ years'
        this.benefits = []; // List of benefits, e.g. ['Health insurance', 'Paid time off']
        this.customInfo = [];
    }
}
exports.JobClass = JobClass;
const JobSchema = new mongoose_1.Schema({
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
JobSchema.index({ AdminID: 1 });
exports.Job = mongoose_1.default.model('Jobs', JobSchema);
