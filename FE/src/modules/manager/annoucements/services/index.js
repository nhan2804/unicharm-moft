import stringifyUrl from "@helper/stringifyUrl";
import axios from "axios";

export const getAnnoucement = async (query) => {
  const { data } = await axios.get(
    stringifyUrl({ url: `annoucements`, query })
  );
  return data;
};
export const showAnnoucement = async (id) => {
  const { data } = await axios.get(`annoucements/${id}`);
  return data;
};
export const createAnnoucement = async (input) => {
  const { data } = await axios.post(`annoucements`, input);
  return data;
};
export const createBulkAnnoucement = async (input) => {
  const { data } = await axios.post(`annoucements/bulk/create`, input);
  return data;
};
export const updateAnnoucement = async (id, input) => {
  const { data } = await axios.patch(`annoucements/${id}`, input);
  return data;
};
export const deleteAnnoucement = async (id) => {
  const { data } = await axios.delete(`annoucements/${id}`);
  return data;
};
export const deleteBulkAnnoucement = async (input) => {
  const { data } = await axios.delete(`annoucements/bulk/delete`, {data: {ids: input}});
  return data;
};
