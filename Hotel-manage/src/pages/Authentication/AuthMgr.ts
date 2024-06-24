import { Api, getPostParamData } from "src/common/ApiCall";

export class _Login {
    email: string = "";

    password: string = "";
}

export class _Register {
    _id?: string = "";
    name: string = "";
    email: string = "";
    password: string = "";
    confirmPassword: string = "";
    profileImg: string = "";
    phone: string = "";
    role: "guest" | "admin" = "admin";
    createdAt: Date = new Date();
}

export class Auth {

    public static Register = async (
        objRegister: _Register,
        onsuccess: (res: any) => void,
        onFail: (err: any) => void
    ) => {
        try {
            const _Param = getPostParamData("ManagerBroker", "CreateManagerAccount");

            const res = await Api.post(_Param, objRegister);
            if (res.error === "") {
                onsuccess(res.data);
            } else {
                onFail(res.error);
            }
        } catch (error: any) {
            onFail(error);
        }
    };

    public static Login = async (
        objLogin: _Login,
        onsuccess: (res: any) => void,
        onFail: (err: any) => void
    ) => {
        try {
            const _Param = getPostParamData("ManagerBroker", "ManagerLogin");
            const res = await Api.post(_Param, objLogin);
            if (res.error === "") {
                onsuccess(res.data);
            } else {
                onFail(res.error);
            }
        } catch (error: any) {
            onFail(error);
        }
    };
}
