import stringifyUrl from "@helper/stringifyUrl";
import axios from "axios";

export const getQuestion = async (query) => {
  const { data } = await axios.get(stringifyUrl({ url: `questions`, query }));
  return data;
};
export const getQuestionRating = async (query) => {
  const { data } = await axios.get(
    stringifyUrl({ url: `questions/rating`, query })
  );
  return data;
};
export const getQuestionPolicy = async (query) => {
  const { data } = await axios.get(
    stringifyUrl({ url: `questions/policy`, query })
  );
  return data;
};
export const showQuestion = async (id) => {
  const { data } = await axios.get(`questions/${id}`);
  return data;
};
export const createQuestion = async (input) => {
  const { data } = await axios.post(`questions`, input);
  return data;
};
export const createBulkQuestion = async (input) => {
  const { data } = await axios.post(`questions/bulk/create`, input);
  return data;
};
export const updateQuestion = async (id, input) => {
  const { data } = await axios.patch(`questions/${id}`, input);
  return data;
};
export const deleteQuestion = async (id) => {
  const { data } = await axios.delete(`questions/${id}`);
  return data;
};
export const deleteBulkQuestion = async (input) => {
  const { data } = await axios.delete(`questions/bulk/delete`, {
    data: { ids: input },
  });
  return data;
};
