import stringifyUrl from "@helper/stringifyUrl";
import axios from "axios";

export const createRating = (data) => {
  return axios.post(`ratings`, data);
};
export const getRatingToday = (query) => {
  const url = stringifyUrl({ url: `ratings/today`, query });
  return axios.get(url);
};
