import stringifyUrl from "@helper/stringifyUrl";
import axios from "axios";

export const getStore = async (query) => {
  const { data } = await axios.get(
    stringifyUrl({ url: `stores`, query })
  );
  return data;
};
export const showStore = async (id) => {
  const { data } = await axios.get(`stores/${id}`);
  return data;
};
export const createStore = async (input) => {
  const { data } = await axios.post(`stores`, input);
  return data;
};
export const createBulkStore = async (input) => {
  const { data } = await axios.post(`stores/bulk/create`, input);
  return data;
};
export const updateStore = async (id, input) => {
  const { data } = await axios.patch(`stores/${id}`, input);
  return data;
};
export const deleteStore = async (id) => {
  const { data } = await axios.delete(`stores/${id}`);
  return data;
};
export const deleteBulkStore = async (input) => {
  const { data } = await axios.delete(`stores/bulk/delete`, {data: {ids: input}});
  return data;
};
