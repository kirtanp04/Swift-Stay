"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTypeString = exports.Convert = void 0;
const Response_1 = require("./Response");
// import { ProjectResponse } from "./Response";
class Convert {
}
exports.Convert = Convert;
Convert.toString = (value) => {
    let _res = new Response_1.ProjectResponse();
    try {
        let StringData = new Response_1.ProjectResponse();
        if (isTypeString(value)) {
            StringData.data = value;
        }
        else {
            StringData.data = JSON.stringify(value);
        }
        if (StringData) {
            _res.data = StringData.data;
        }
        else {
            _res.error = (0, Response_1.errorPath)('common/Convert', 'toString', 19) + ' Error While Converting to String';
        }
    }
    catch (error) {
        _res.error = (0, Response_1.errorPath)('common/Convert', 'toString', 22) + error.message;
    }
    finally {
        return _res;
    }
};
Convert.toParse = (value) => {
    let _res = new Response_1.ProjectResponse();
    try {
        const parseData = JSON.parse(value);
        if (parseData) {
            _res.data = parseData;
        }
        else {
            _res.error = (0, Response_1.errorPath)('common/Convert', 'toParse', 36) + ' Not able to Parse Value';
        }
    }
    catch (error) {
        _res.error = (0, Response_1.errorPath)('common/Convert', 'toParse', 39) + error.message;
    }
    finally {
        return _res;
    }
};
function isTypeString(value) {
    if (typeof value === 'string') {
        return true;
    }
    else {
        return false;
    }
}
exports.isTypeString = isTypeString;
