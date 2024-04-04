import { getQuestionSubmit } from "@modules/manager/services/question-submit";
import { useQuery } from "react-query";

const useGetQuestionSubmit = (query) => {
  return useQuery(["question-submit", query], async () => {
    const data = await getQuestionSubmit(query);

    return data;
  });
};

export default useGetQuestionSubmit;
