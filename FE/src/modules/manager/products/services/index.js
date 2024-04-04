import stringifyUrl from "@helper/stringifyUrl";
import axios from "axios";

export const getProduct = async (query) => {
  const { data } = await axios.get(
    stringifyUrl({ url: `products`, query })
  );
  return data;
};
export const showProduct = async (id) => {
  const { data } = await axios.get(`products/${id}`);
  return data;
};
export const createProduct = async (input) => {
  const { data } = await axios.post(`products`, input);
  return data;
};
export const createBulkProduct = async (input) => {
  const { data } = await axios.post(`products/bulk/create`, input);
  return data;
};
export const updateProduct = async (id, input) => {
  const { data } = await axios.patch(`products/${id}`, input);
  return data;
};
export const deleteProduct = async (id) => {
  const { data } = await axios.delete(`products/${id}`);
  return data;
};
export const deleteBulkProduct = async (input) => {
  const { data } = await axios.delete(`products/bulk/delete`, {data: {ids: input}});
  return data;
};
