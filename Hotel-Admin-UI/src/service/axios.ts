import axios from "axios";
import { Crypt } from "src/common/Crypt";
import { BackendBaseApi } from "src/Constant";
import { SecretKey } from "src/env";

const axiosCall = axios.create({
    baseURL: BackendBaseApi + '/swiftstay/manager/api',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        'x-api-key': Crypt.Encryption({ key: SecretKey.apiKey, time: new Date() }).data

    },
    maxContentLength: 10000000,
    maxBodyLength: 10000000,
    timeout: 30000, // 30 seconds timeout
    withCredentials: true,
});

axiosCall.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            console.error(`Error: ${error.response.status}`, error.response.data);
        } else {
            console.error("Error", error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosCall;
