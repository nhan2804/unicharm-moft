import { getShift } from "@modules/staff/services/shift";
import { useQuery } from "react-query";

const useGetShift = () => {
  return useQuery(
    ["shift"],
    async () => {
      const data = await getShift();
      return data;
    },
    {
      refetchOnMount: false,
      cacheTime: 1000 * 60 * 60 * 24,
    }
  );
};

export default useGetShift;
