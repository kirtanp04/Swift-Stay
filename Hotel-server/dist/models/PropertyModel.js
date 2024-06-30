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
var enumPropertyType;
(function (enumPropertyType) {
    enumPropertyType["Hotel"] = "Hotel";
    enumPropertyType["Resort"] = "Resort";
    enumPropertyType["Apartment"] = "Apartment";
    enumPropertyType["Bungalow"] = "Bungalow";
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
        this.createdAt = new Date();
    }
}
exports.PropertyClass = PropertyClass;
const PropertySchema = new mongoose_1.Schema({
    adminID: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: [true, 'Property name is required.'] },
    propertyType: { enum: [enumPropertyType.Hotel, enumPropertyType.Resort, enumPropertyType.Bungalow, enumPropertyType.Apartment], default: enumPropertyType.Hotel },
    address: { type: String, required: [true, 'Property address is required.'] },
    city: { type: String, required: [true, 'city is required.'] },
    state: { type: String, required: [true, 'state is required.'] },
    country: { type: String, required: [true, 'country is required.'] },
    zipCode: { type: String, required: [true, 'zip code is required.'] },
    phone: { type: String, required: [true, 'phone number is required.'] },
    email: { type: String, required: [true, 'email is required.'] },
    website: { type: String },
    description: { type: String },
    rooms: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Room' }],
    amenities: [String],
    images: [String],
    createdAt: { type: Date },
});
exports.Property = mongoose_1.default.model('Property', PropertySchema);
// type: { type: String, enum: ['hotel', 'resort', 'apartment', 'bungalow'], required: true },
// name: { type: String, required: true },
// description: { type: String },
// location: {
//   address: { type: String },
//   city: { type: String },
//   state: { type: String },
//   country: { type: String }
// },
// // Common fields for all types
// rating: { type: Number },
// rooms: { type: Number },
// amenities: [{ type: String }],
// // Specific fields for each type
// // Example for 'hotel'
// stars: { type: Number },
// // Example for 'resort'
// activities: [{ type: String }],
// // Example for 'apartment'
// roomsDetails: [{
//   roomNumber: { type: Number },
//   price: { type: Number }
// }],
// // Example for 'bungalow'
// hasGarden: { type: Boolean },
// // Additional common fields
// createdAt: { type: Date, default: Date.now }
// });
