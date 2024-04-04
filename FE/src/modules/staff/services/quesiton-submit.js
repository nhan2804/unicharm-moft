import stringifyUrl from "@helper/stringifyUrl";
import axios from "axios";

export const getCheckIn = async (placeId, query) => {
  const { data } = await axios.get(
    stringifyUrl({ url: `/stores/${placeId}/checkin/today`, query })
  );
  return data;
};
export const createQuestionSubmit = async (formData) => {
  const { data } = await axios.post(`question-submit`, formData);
  return data;
};

export const getQuestionToday = async () => {
  const { data } = await axios.get(`question-submit/today`);
  return data;
};
export const getQuestionForStaff = async () => {
  const { data } = await axios.get(`questions/staff`);
  return data;
};
