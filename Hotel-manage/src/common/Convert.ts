import { ProjectResponse } from "./Response";


export class Convert {
    static toString = (value: any): ProjectResponse => {
        let _res: ProjectResponse = new ProjectResponse();
        try {
            let StringData: ProjectResponse = new ProjectResponse();
            if (isTypeString(value)) {
                StringData.data = value
            } else {
                StringData.data = JSON.stringify(value);
            }


            if (StringData) {
                _res.data = StringData.data;
            } else {
                _res.error = ' Error While Converting to String';
            }
        } catch (error: any) {
            _res.error = error;
        } finally {
            return _res;
        }
    };

    static toParse = (value: string): ProjectResponse => {
        let _res: ProjectResponse = new ProjectResponse();
        try {
            const parseData = JSON.parse(value);

            if (parseData) {
                _res.data = parseData;
            } else {
                _res.error = ' Not able to Parse Value';
            }
        } catch (error: any) {
            _res.error = error;
        } finally {
            return _res;
        }
    };
}


export function isTypeString(value: unknown): boolean {
    if (typeof value === "string") {
        return true;
    } else {
        return false;
    }
}
