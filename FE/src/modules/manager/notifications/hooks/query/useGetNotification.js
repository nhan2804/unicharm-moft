import { getNotification } from "../../services/index";
import { useQuery } from "react-query";

const useGetNotification = (query) => {
  return useQuery({
    queryKey:["notifications",query],
    queryFn:async () => {
      return await getNotification(query);
    }
  });
};

export default useGetNotification;
