import { getQuestion } from "../../services/index";
import { useQuery } from "react-query";

const useGetQuestion = (query) => {
  return useQuery({
    queryKey:["questions",query],
    queryFn:async () => {
      return await getQuestion(query);
    }
  });
};

export default useGetQuestion;
