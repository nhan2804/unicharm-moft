import stringifyUrl from "@helper/stringifyUrl";
import axios from "axios";

export const getMyStore = async (query) => {
  const { data } = await axios.get(stringifyUrl({ url: `stores/my`, query }));
  return data;
};
