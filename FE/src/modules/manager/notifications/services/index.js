import stringifyUrl from "@helper/stringifyUrl";
import axios from "axios";

export const getNotification = async (query) => {
  const { data } = await axios.get(
    stringifyUrl({ url: `notifications`, query })
  );
  return data;
};
export const showNotification = async (id) => {
  const { data } = await axios.get(`notifications/${id}`);
  return data;
};
export const createNotification = async (input) => {
  const { data } = await axios.post(`notifications`, input);
  return data;
};
export const createBulkNotification = async (input) => {
  const { data } = await axios.post(`notifications/bulk/create`, input);
  return data;
};
export const updateNotification = async (id, input) => {
  const { data } = await axios.patch(`notifications/${id}`, input);
  return data;
};
export const deleteNotification = async (id) => {
  const { data } = await axios.delete(`notifications/${id}`);
  return data;
};
export const deleteBulkNotification = async (input) => {
  const { data } = await axios.delete(`notifications/bulk/delete`, {data: {ids: input}});
  return data;
};
