import { getQuestionToday } from "@modules/staff/services/quesiton-submit";
import { useQuery } from "react-query";

const useGetQuestionToday = () => {
  return useQuery(["question-today"], async () => {
    const data = await getQuestionToday();
    return data;
  });
};

export default useGetQuestionToday;
