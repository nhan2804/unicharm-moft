import { getStore } from "../../services/index";
import { useQuery } from "react-query";

const useGetStore = (query) => {
  return useQuery({
    queryKey: ["stores", query],
    queryFn: async () => {
      const data = await getStore(query);
      return { data };
    },
    refetchOnMount: false,

    cacheTime: 1000 * 60 * 60 * 24,
  });
};

export default useGetStore;
