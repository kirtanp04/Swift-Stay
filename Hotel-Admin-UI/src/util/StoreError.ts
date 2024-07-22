import { StorageError } from "src/Types";
import { Convert } from "src/common/Convert";

export const StoreError = (module: string, error: any) => {
    const allError: string | null = localStorage.getItem("Error");

    if (allError) {
        const objError = Convert.toParse(allError);
        if (objError.error === "") {
            let arrError: StorageError[] = objError.data;
            let isUpdated: boolean = false;
            for (let index = 0; index < arrError.length; index++) {
                const objErr = arrError[index];
                if (objErr.error === error && objErr.module === module) {
                    arrError[index].date = new Date();
                    isUpdated = true;
                    break;
                }
            }

            if (!isUpdated) {
                arrError.push({ module: module, error: error, date: new Date() });
            }

            const stringError = Convert.toString(arrError);
            if (stringError.error === "") {
                localStorage.setItem("Error", stringError.data);
            }
        }
    } else {
        const _objNewError: StorageError[] = [
            { module: module, error: error, date: new Date() },
        ];
        const stringError = Convert.toString(_objNewError);
        if (stringError.error === "") {
            localStorage.setItem("Error", stringError.data);
        }
    }
};
