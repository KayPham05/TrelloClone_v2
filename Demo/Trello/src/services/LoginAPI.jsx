import axiosClient from "./axios/axiosApi";

const END_POINT = {
  AUTH: "login",
};


export const registerAPI = (user) => {
  return axiosClient.post(`${END_POINT.AUTH}/register`, user);
};

export const loginAPI = (user) => {
  return axiosClient.post(`${END_POINT.AUTH}/login`, user);
};

export const LoginGoogleAPI = (accessToken) => {
  return axiosClient.post(`${END_POINT.AUTH}/Google-login`,accessToken);
};
