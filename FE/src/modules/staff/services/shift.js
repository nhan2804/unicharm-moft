import stringifyUrl from "@helper/stringifyUrl";
import axios from "axios";

export const getShift = async (query) => {
  const { data } = await axios.get(stringifyUrl({ url: `/shifts`, query }));
  return data;
};
