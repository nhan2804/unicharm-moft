import { showUser } from "../../services/index";
import { useQuery } from "react-query";

const useShowUser = (query) => {
  return useQuery(["detail-users",query], async () => {
    return await showUser(query);
  });
};

export default useShowUser;
