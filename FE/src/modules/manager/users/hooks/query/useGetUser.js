import { getUser } from "../../services/index";
import { useQuery } from "react-query";

const useGetUser = (query) => {
  return useQuery({
    queryKey: ["users", query],
    queryFn: async () => {
      const data = await getUser(query);
      return data;
    },

    refetchOnMount: false,
    cacheTime: 1000 * 60 * 60 * 24,
  });
};

export default useGetUser;
