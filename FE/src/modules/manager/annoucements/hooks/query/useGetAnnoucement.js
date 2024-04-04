import { getAnnoucement } from "../../services/index";
import { useQuery } from "react-query";

const useGetAnnoucement = (query) => {
  return useQuery({
    queryKey:["annoucements",query],
    queryFn:async () => {
      return await getAnnoucement(query);
    }
  });
};

export default useGetAnnoucement;
