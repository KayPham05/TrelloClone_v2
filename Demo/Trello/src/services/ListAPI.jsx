import AxiosClient from "./axios/axiosApi";
const END_POINT = {
  LISTS: "lists",
};

export const getListsByBoardIdAPI = (boardUId) => {
  return AxiosClient.get(`${END_POINT.LISTS}/?boardUId=${boardUId}`);
}

export const createListAPI = (list) => {
  return AxiosClient.post(`${END_POINT.LISTS}`, list);
}

export const updateListStatusAPI = (id, newStatus) => {
  return AxiosClient.put(`${END_POINT.LISTS}/${id}?newStatus=${newStatus}`);
}