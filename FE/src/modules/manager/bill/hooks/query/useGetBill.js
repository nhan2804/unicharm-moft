import { useQuery } from "react-query";
import { getBills } from "../../service";

const useGetBill = (query, refresh = false) => {
  return useQuery(
    ["bills", query],
    async () => {
      return await getBills(query);
    },
    {
      refetchInterval: refresh ? 10000 : false,
      refetchIntervalInBackground: refresh,
    }
  );
};

export default useGetBill;
