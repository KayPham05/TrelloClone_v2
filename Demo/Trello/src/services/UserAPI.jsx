import axiosClient from "./axios/axiosApi";
const END_POINT = {
    USER: "users"
}

export const getUserByEmailAPI = (email) => {
    return axiosClient.get(`${END_POINT.USER}/get-by-email`, {
        params: { email },
    } );
}

export const verificodeAPI = (email, code) => {
    return axiosClient.post(`${END_POINT.USER}/verify-code`, {
         email, code
    })
}

export const resendCodeAPI = (email) => {
    return axiosClient.post(`${END_POINT.USER}/resend-code`, null, {
        params:{email}
    })
}
