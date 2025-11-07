import axiosClient from "./axios/axiosApi";
const END_POINT = {
    USER: "users"
}

export const getUserByEmailAPI = (email) => {
    return axiosClient.get(`${END_POINT.USER}/get-by-email`, {
        params: { email },
    } );
}