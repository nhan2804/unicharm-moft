import stringifyUrl from "@helper/stringifyUrl";
import axios from "axios";

export const getDepartment = async (query) => {
  const { data } = await axios.get(
    stringifyUrl({ url: `departments`, query })
  );
  return data;
};
export const showDepartment = async (id) => {
  const { data } = await axios.get(`departments/${id}`);
  return data;
};
export const createDepartment = async (input) => {
  const { data } = await axios.post(`departments`, input);
  return data;
};
export const createBulkDepartment = async (input) => {
  const { data } = await axios.post(`departments/bulk/create`, input);
  return data;
};
export const updateDepartment = async (id, input) => {
  const { data } = await axios.patch(`departments/${id}`, input);
  return data;
};
export const deleteDepartment = async (id) => {
  const { data } = await axios.delete(`departments/${id}`);
  return data;
};
export const deleteBulkDepartment = async (input) => {
  const { data } = await axios.delete(`departments/bulk/delete`, {data: {ids: input}});
  return data;
};
