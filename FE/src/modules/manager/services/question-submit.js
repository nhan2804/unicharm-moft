import stringifyUrl from "@helper/stringifyUrl";
import axios from "axios";

export const getQuestionSubmit = async (query) => {
  const { data } = await axios.get(
    stringifyUrl({ url: `/question-submit`, query })
  );
  return data;
};
