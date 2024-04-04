import stringifyUrl from "@helper/stringifyUrl";
import axios from "axios";

export const getUser = async (query) => {
  const { data } = await axios.get(
    stringifyUrl({ url: `users`, query })
  );
  return data;
};
export const showUser = async (id) => {
  const { data } = await axios.get(`users/${id}`);
  return data;
};
export const createUser = async (input) => {
  const { data } = await axios.post(`users`, input);
  return data;
};
export const createBulkUser = async (input) => {
  const { data } = await axios.post(`users/bulk/create`, input);
  return data;
};
export const updateUser = async (id, input) => {
  const { data } = await axios.patch(`users/${id}`, input);
  return data;
};
export const deleteUser = async (id) => {
  const { data } = await axios.delete(`users/${id}`);
  return data;
};
export const deleteBulkUser = async (input) => {
  const { data } = await axios.delete(`users/bulk/delete`, {data: {ids: input}});
  return data;
};
