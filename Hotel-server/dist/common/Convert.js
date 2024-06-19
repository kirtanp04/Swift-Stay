"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Convert = void 0;
const Response_1 = require("./Response");
class Convert {
}
exports.Convert = Convert;
Convert.toString = (value) => {
    let _res = new Response_1.ProjectResponse();
    try {
        const stringData = JSON.stringify(value);
        if (stringData) {
            _res.data = stringData;
        }
        else {
            _res.error = 'Server Error: Error While Converting to String';
        }
    }
    catch (error) {
        _res.error = (0, Response_1.errorPath)('common/Convert', 'toString', 15) + error;
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
            _res.error = 'Server Error: Not able to Parse Value';
        }
    }
    catch (error) {
        _res.error = (0, Response_1.errorPath)('common/Convert', 'toParse', 32) + error;
    }
    finally {
        return _res;
    }
};
