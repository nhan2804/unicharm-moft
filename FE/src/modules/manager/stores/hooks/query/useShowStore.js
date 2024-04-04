import { showStore } from "../../services/index";
import { useQuery } from "react-query";

const useShowStore = (query) => {
  return useQuery(
    ["detail-stores", query],
    async () => {
      return await showStore(query);
    },
    {
      enabled: !!query,
    }
  );
};

export default useShowStore;
