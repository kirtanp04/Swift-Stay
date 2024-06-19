"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorPath = exports.UserResponse = exports.ProjectResponse = void 0;
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
