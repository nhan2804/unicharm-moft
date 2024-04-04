import stringifyUrl from "@helper/stringifyUrl";
import axios from "axios";

export const getReport = async (placeId, type, query) => {
  const { data } = await axios.get(
    stringifyUrl({ url: `/stores/${placeId}/report/${type}/today`, query })
  );
  return data;
};
export const createReport = async (placeId, type, formData) => {
  const { data } = await axios.post(
    `stores/${placeId}/report/${type}`,
    formData
  );
  return data;
};
export const updateReport = async (placeId, id, formData) => {
  const { data } = await axios.patch(
    `stores/${placeId}/report/${id}`,
    formData
  );
  return data;
};
