import stringifyUrl from "@helper/stringifyUrl";
import axios from "axios";

export const getGroupimage = async (query) => {
  const { data } = await axios.get(
    stringifyUrl({ url: `group-image`, query })
  );
  return data;
};
export const showGroupimage = async (id) => {
  const { data } = await axios.get(`group-image/${id}`);
  return data;
};
export const createGroupimage = async (input) => {
  const { data } = await axios.post(`group-image`, input);
  return data;
};
export const createBulkGroupimage = async (input) => {
  const { data } = await axios.post(`group-image/bulk/create`, input);
  return data;
};
export const updateGroupimage = async (id, input) => {
  const { data } = await axios.patch(`group-image/${id}`, input);
  return data;
};
export const deleteGroupimage = async (id) => {
  const { data } = await axios.delete(`group-image/${id}`);
  return data;
};
export const deleteBulkGroupimage = async (input) => {
  const { data } = await axios.delete(`group-image/bulk/delete`, {data: {ids: input}});
  return data;
};
