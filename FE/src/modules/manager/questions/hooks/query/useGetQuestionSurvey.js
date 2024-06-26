import { getQuestionSurvey } from "../../services/index";
import { useQuery } from "react-query";

const useGetQuestionSurvey = (query) => {
  return useQuery({
    queryKey: ["question-survey", query],
    queryFn: async () => {
      return await getQuestionSurvey(query);
    },
  });
};

export default useGetQuestionSurvey;
