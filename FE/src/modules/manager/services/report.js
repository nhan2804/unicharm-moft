import stringifyUrl from "@helper/stringifyUrl";
import axios from "axios";

export const getManagerReport = async (type, query) => {
  const { data } = await axios.get(
    stringifyUrl({ url: `/report/${type}`, query })
  );
  return data;
};
