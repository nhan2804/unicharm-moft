import stringifyUrl from "@helper/stringifyUrl";
import axios from "axios";

export const getPolicy = async (query) => {
  const { data } = await axios.get(
    stringifyUrl({ url: `policies`, query })
  );
  return data;
};
export const showPolicy = async (id) => {
  const { data } = await axios.get(`policies/${id}`);
  return data;
};
export const createPolicy = async (input) => {
  const { data } = await axios.post(`policies`, input);
  return data;
};
export const createBulkPolicy = async (input) => {
  const { data } = await axios.post(`policies/bulk/create`, input);
  return data;
};
export const updatePolicy = async (id, input) => {
  const { data } = await axios.patch(`policies/${id}`, input);
  return data;
};
export const deletePolicy = async (id) => {
  const { data } = await axios.delete(`policies/${id}`);
  return data;
};
export const deleteBulkPolicy = async (input) => {
  const { data } = await axios.delete(`policies/bulk/delete`, {data: {ids: input}});
  return data;
};
