import { getPolicy } from "../../services/index";
import { useQuery } from "react-query";

const useGetPolicy = (query) => {
  return useQuery({
    queryKey:["policys",query],
    queryFn:async () => {
      return await getPolicy(query);
    }
  });
};

export default useGetPolicy;
