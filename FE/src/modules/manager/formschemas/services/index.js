import stringifyUrl from "@helper/stringifyUrl";
import axios from "axios";

export const getFormschema = async (query) => {
  const { data } = await axios.get(
    stringifyUrl({ url: `form-schemas`, query })
  );
  return data;
};
export const showFormschema = async (id) => {
  const { data } = await axios.get(`form-schemas/${id}`);
  return data;
};
export const createFormschema = async (input) => {
  const { data } = await axios.post(`form-schemas`, input);
  return data;
};
export const createBulkFormschema = async (input) => {
  const { data } = await axios.post(`form-schemas/bulk/create`, input);
  return data;
};
export const updateFormschema = async (id, input) => {
  const { data } = await axios.patch(`form-schemas/${id}`, input);
  return data;
};
export const deleteFormschema = async (id) => {
  const { data } = await axios.delete(`form-schemas/${id}`);
  return data;
};
export const deleteBulkFormschema = async (input) => {
  const { data } = await axios.delete(`form-schemas/bulk/delete`, {data: {ids: input}});
  return data;
};
