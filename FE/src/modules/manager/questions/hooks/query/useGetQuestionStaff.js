import { getQuestionRating } from "../../services/index";
import { useQuery } from "react-query";

const useGetQuestionRating = (query) => {
  return useQuery({
    queryKey: ["question-rating", query],
    queryFn: async () => {
      return await getQuestionRating(query);
    },
  });
};

export default useGetQuestionRating;
