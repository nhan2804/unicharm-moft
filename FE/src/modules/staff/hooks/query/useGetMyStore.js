import { getMyStore } from "../../services/store";
import { useQuery } from "react-query";

const useGetMyStore = (query) => {
  return useQuery({
    queryKey: ["my-stores", query],
    queryFn: async () => {
      return await getMyStore(query);
    },
  });
};

export default useGetMyStore;
