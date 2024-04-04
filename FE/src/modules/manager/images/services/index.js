import stringifyUrl from "@helper/stringifyUrl";
import axios from "axios";

export const getImage = async (query) => {
  const { data } = await axios.get(
    stringifyUrl({ url: `images`, query })
  );
  return data;
};
export const showImage = async (id) => {
  const { data } = await axios.get(`images/${id}`);
  return data;
};
export const createImage = async (input) => {
  const { data } = await axios.post(`images`, input);
  return data;
};
export const createBulkImage = async (input) => {
  const { data } = await axios.post(`images/bulk/create`, input);
  return data;
};
export const updateImage = async (id, input) => {
  const { data } = await axios.patch(`images/${id}`, input);
  return data;
};
export const deleteImage = async (id) => {
  const { data } = await axios.delete(`images/${id}`);
  return data;
};
export const deleteBulkImage = async (input) => {
  const { data } = await axios.delete(`images/bulk/delete`, {data: {ids: input}});
  return data;
};
