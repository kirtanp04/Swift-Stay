import axios from "axios";

const axiosCall = axios.create({
    baseURL: "http://localhost:4500/swiftstay/guest/api/",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 30000, // 30 seconds timeout
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
