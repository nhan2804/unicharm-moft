import { getQuestionPolicy } from "../../services/index";
import { useQuery } from "react-query";

const useGetQuestionPolicy = (query) => {
  return useQuery({
    queryKey: ["questions-policy", query],
    queryFn: async () => {
      return await getQuestionPolicy(query);
    },
  });
};

export default useGetQuestionPolicy;
