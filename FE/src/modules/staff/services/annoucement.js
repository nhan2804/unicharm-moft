import stringifyUrl from "@helper/stringifyUrl";
import axios from "axios";

export const fetchAnnoucement = async (query) => {
  const { data } = await axios.get(
    stringifyUrl({ url: `/annoucements/active`, query })
  );
  return data;
};
