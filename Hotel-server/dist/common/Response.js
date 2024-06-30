"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserSuccessObj = exports.GetUserErrorObj = exports.errorPath = exports.UserResponse = exports.ProjectResponse = void 0;
class ProjectResponse {
    constructor() {
        this.data = '';
        this.error = '';
    }
}
exports.ProjectResponse = ProjectResponse;
class UserResponse {
    constructor() {
        this.statusCode = 200;
        this.Message = '';
        this.isError = false;
    }
}
exports.UserResponse = UserResponse;
const errorPath = (fileName, functionName, lineNumber) => {
    let _errorPath;
    _errorPath = `Server Error: File name: ${fileName}  / Function: ${functionName} / Line: ${lineNumber} `;
    return _errorPath;
};
exports.errorPath = errorPath;
const GetUserErrorObj = (errMess, statusCode) => {
    let _objErr = new UserResponse();
    _objErr.Message = errMess;
    _objErr.data = '';
    _objErr.isError = true;
    _objErr.statusCode = statusCode || 404;
    return _objErr;
};
exports.GetUserErrorObj = GetUserErrorObj;
const GetUserSuccessObj = (Data, statusCode) => {
    let _objSucc = new UserResponse();
    _objSucc.Message = '';
    _objSucc.data = Data;
    _objSucc.isError = false;
    _objSucc.statusCode = statusCode || 404;
    return _objSucc;
};
exports.GetUserSuccessObj = GetUserSuccessObj;
