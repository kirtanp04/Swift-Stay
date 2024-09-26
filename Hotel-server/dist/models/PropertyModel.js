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
exports.Property = exports.PropertyClass = exports.enumPropertyType = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const Review_1 = require("./Review");
const Subscriber_1 = require("./Subscriber");
var enumPropertyType;
(function (enumPropertyType) {
    enumPropertyType["Hotel"] = "Hotel";
    enumPropertyType["Resort"] = "Resort";
    enumPropertyType["Apartment"] = "Apartment";
    enumPropertyType["Bungalow"] = "Bungalow";
    enumPropertyType["Villa"] = "Villa";
    enumPropertyType["Cottage"] = "Cottage";
})(enumPropertyType || (exports.enumPropertyType = enumPropertyType = {}));
class PropertyClass {
    constructor() {
        this._id = '';
        this.adminID = '';
        this.name = '';
        this.propertyType = enumPropertyType.Hotel;
        this.address = '';
        this.city = '';
        this.state = '';
        this.country = '';
        this.zipCode = '';
        this.phone = '';
        this.email = '';
        this.website = '';
        this.description = '';
        this.amenities = [];
        this.images = [];
        this.rooms = [];
        this.reviews = new Review_1.ReviewClass();
        this.subscribers = new Subscriber_1.SubscriberClass();
        this.jobHiring = false;
        this.checkInTime = '';
        this.checkOutTime = '';
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}
exports.PropertyClass = PropertyClass;
const PropertySchema = new mongoose_1.Schema({
    adminID: { type: String, required: [true, 'Admin ID is required.'] },
    name: { type: String, required: [true, 'Property name is required.'] },
    propertyType: { type: String, enum: Object.values(enumPropertyType), default: enumPropertyType.Hotel },
    address: { type: String, required: [true, 'Property address is required.'] },
    city: { type: String, required: [true, 'City is required.'] },
    state: { type: String, required: [true, 'State is required.'] },
    country: { type: String, required: [true, 'Country is required.'] },
    zipCode: { type: String, required: [true, 'Zip code is required.'] },
    phone: { type: String, required: [true, 'Phone number is required.'] },
    email: { type: String, required: [true, 'Email is required.'] },
    website: { type: String },
    description: { type: String },
    checkInTime: { type: String },
    checkOutTime: { type: String },
    rooms: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Room' }],
    reviews: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Review' },
    subscribers: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Subscriber' },
    amenities: [String],
    images: [String],
    jobHiring: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
PropertySchema.index({ adminID: 1 });
exports.Property = mongoose_1.default.model('Property', PropertySchema);
