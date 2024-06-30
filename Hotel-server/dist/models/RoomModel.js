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
exports.Room = exports.RoomClass = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const PropertyModel_1 = require("./PropertyModel");
class RoomClass {
    constructor() {
        this._id = '';
        this.property = new PropertyModel_1.PropertyClass();
        this.roomNumber = '';
        this.type = ''; // e.g., single, double, suite
        this.description = '';
        this.amenities = [];
        this.price = 0;
        this.maxOccupancy = 0;
        this.isAvailable = true;
        this.createdAt = new Date();
    }
}
exports.RoomClass = RoomClass;
const RoomSchema = new mongoose_1.Schema({
    property: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Property', required: true }, // propertyID will inserted
    roomNumber: { type: String, required: [true, 'Property room number is required'] },
    type: { type: String, required: [true, ' Room type is required'] }, // e.g., single, double, suite
    description: { type: String },
    amenities: [String],
    price: { type: Number, required: [true, 'Room price is required'] },
    maxOccupancy: { type: Number, required: [true, 'Room max occupancy is required'] },
    isAvailable: { type: Boolean, default: true },
    createdAt: { type: Date }
});
exports.Room = mongoose_1.default.model('Room', RoomSchema);
