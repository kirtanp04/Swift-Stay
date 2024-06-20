
export class ProjectResponse {
    data: any = '';

    error: any = '';
}



export class UserResponse {

    data: any

    statusCode: number = 200

    Message: string = '';

    isError: boolean = false;
}



export const errorPath = (fileName: string, functionName: string, lineNumber: number): string => {
    let _errorPath: string
    _errorPath = `Server Error: File name: ${fileName}  / Function: ${functionName} / Line: ${lineNumber} `
    return _errorPath
}

export const GetUserErrorObj = (errMess: string, statusCode?: number): UserResponse => {

    let objErrMess = new UserResponse()
    objErrMess.Message = errMess
    objErrMess.data = ''
    objErrMess.isError = true
    objErrMess.statusCode = statusCode || 404

    return objErrMess

}