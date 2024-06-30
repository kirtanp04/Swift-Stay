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
exports.PropertyFunction = void 0;
const common_1 = require("../common");
const Type_1 = require("../types/Type");
const Constant_1 = require("../Constant");
const PropertyModel_1 = require("../models/PropertyModel");
const UserModel_1 = require("../models/UserModel");
const _AddProperty = Constant_1.Param.function.manager.Property.AddProperty;
const _GetSingleProperty = Constant_1.Param.function.manager.Property.GetSingleProperty;
const _GetAllProperty = Constant_1.Param.function.manager.Property.GetAllProperty;
class PropertyFunction {
}
exports.PropertyFunction = PropertyFunction;
_a = PropertyFunction;
PropertyFunction.objUserResponse = new common_1.UserResponse();
PropertyFunction.findFunction = (objParam, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let _Function = new Functions();
    _Function.req = req;
    _Function.res = res;
    _Function.next = next;
    _Function.objParam = objParam;
    if (objParam.function === _AddProperty) {
        const _res = yield _Function.addNewProperty();
        _a.objUserResponse = _res;
    }
    else if (objParam.function === _GetSingleProperty) {
        const _res = yield _Function.getSingleProperty();
        _a.objUserResponse = _res;
    }
    else if (objParam.function === _GetAllProperty) {
        const _res = yield _Function.getAllProperty();
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
        this.addNewProperty = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const { address, adminID, amenities, city, country, createdAt, description, email, images, name, phone, propertyType, rooms, state, website, zipCode, } = this.objParam.data;
                const cacheData = common_1.Cache.getCacheData(Constant_1.CacheKey.property);
                const checkUser = yield UserModel_1.User.findOne({ email: adminID });
                if (checkUser) {
                    if (checkUser.role === UserModel_1.enumUserRole.admin) {
                        const _Property = yield PropertyModel_1.Property.create({
                            address: address,
                            adminID: adminID,
                            amenities: amenities,
                            city: city,
                            country: country,
                            createdAt: createdAt,
                            description: description,
                            email: email,
                            images: images,
                            name: name,
                            phone: phone,
                            propertyType: propertyType,
                            rooms: rooms,
                            state: state,
                            website: website,
                            zipCode: zipCode,
                        });
                        const isSave = yield _Property.save();
                        if (isSave) {
                            this.objUserResponse = (0, common_1.GetUserSuccessObj)(`Success: New ` + propertyType + ` has been created.`, common_1.HttpStatusCodes.CREATED);
                            if (cacheData.data !== '') {
                                common_1.Cache.ClearCache(Constant_1.CacheKey.property);
                            }
                        }
                        else {
                            this.objUserResponse = (0, common_1.GetUserErrorObj)(`Server error not able to save ` + propertyType + `. Create Manager account first.`, common_1.HttpStatusCodes.BAD_REQUEST);
                        }
                    }
                    else {
                        this.objUserResponse = (0, common_1.GetUserErrorObj)(`You are not Manager to create ` + propertyType + `. Create Manager account first.`, common_1.HttpStatusCodes.NOT_ACCEPTABLE);
                    }
                }
                else {
                    this.objUserResponse = (0, common_1.GetUserErrorObj)('You are not authenticated. Create account first.', common_1.HttpStatusCodes.NOT_EXTENDED);
                }
            }
            catch (error) {
            }
            finally {
                return this.objUserResponse;
            }
        });
        this.getSingleProperty = () => __awaiter(this, void 0, void 0, function* () {
            try {
            }
            catch (error) {
            }
            finally {
                return this.objUserResponse;
            }
        });
        this.getAllProperty = () => __awaiter(this, void 0, void 0, function* () {
            try {
            }
            catch (error) {
            }
            finally {
                return this.objUserResponse;
            }
        });
    }
}
