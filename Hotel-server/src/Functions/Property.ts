import { NextFunction, Request, Response } from "express";
import { GetUserErrorObj, HttpStatusCodes, UserResponse } from "../common";
import { TParam } from "../types/Type";
import { Param } from "../Constant";
import { PropertyClass } from "../Models/PropertyModel";

const _AddProperty = Param.function.manager.Property.AddProperty
const _GetSingleProperty = Param.function.manager.Property.GetSingleProperty
const _GetAllProperty = Param.function.manager.Property.GetAllProperty

export class PropertyFunction {
    private static objUserResponse: UserResponse = new UserResponse();

    static findFunction = async (objParam: TParam, req: Request, res: Response, next: NextFunction): Promise<UserResponse> => {
        let _Function = new Functions();
        _Function.req = req;
        _Function.res = res;
        _Function.next = next;
        _Function.objParam = objParam;

        if (objParam.function === _AddProperty) {
            const _res = await _Function.addNewProperty();
            this.objUserResponse = _res;
        } else if (objParam.function === _GetSingleProperty) {
            const _res = await _Function.getSingleProperty();
            this.objUserResponse = _res;
        } else if (objParam.function === _GetAllProperty) {
            const _res = await _Function.getAllProperty();
            this.objUserResponse = _res;
        } else {
            this.objUserResponse = GetUserErrorObj('Server error: Wronge Function.', HttpStatusCodes.BAD_REQUEST);
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

    public addNewProperty = async (): Promise<UserResponse> => {




        try {

            const { address, adminID, amenities, city, country, createdAt, description, email, images, name, phone, propertyType, rooms, state, website, zipCode } = this.objParam!.data as PropertyClass

            console.log(this.objParam!.data)

        } catch (error) {

        } finally {
            return this.objUserResponse
        }
    }

    public getSingleProperty = async (): Promise<UserResponse> => {




        try {

        } catch (error) {

        } finally {
            return this.objUserResponse
        }
    }

    public getAllProperty = async (): Promise<UserResponse> => {




        try {

        } catch (error) {

        } finally {
            return this.objUserResponse
        }
    }

}