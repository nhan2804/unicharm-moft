import { showPolicy } from "../../services/index";
import { useQuery } from "react-query";

const useShowPolicy = (query) => {
  return useQuery(["detail-policys",query], async () => {
    return await showPolicy(query);
  });
};

export default useShowPolicy;
