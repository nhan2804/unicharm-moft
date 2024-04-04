import stringifyUrl from "@helper/stringifyUrl";
import axios from "axios";

export const fetchRating = async (query) => {
  const { data } = await axios.get(stringifyUrl({ url: `/ratings`, query }));
  return data;
};
