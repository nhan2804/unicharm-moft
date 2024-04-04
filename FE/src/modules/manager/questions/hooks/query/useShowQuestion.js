import { showQuestion } from "../../services/index";
import { useQuery } from "react-query";

const useShowQuestion = (query) => {
  return useQuery(["detail-questions",query], async () => {
    return await showQuestion(query);
  });
};

export default useShowQuestion;
