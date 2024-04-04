import { getRatingToday } from "@modules/rating/services";
import { useMutation, useQuery } from "react-query";

const useGetRatingToday = (query) => {
  return useQuery({
    queryKey: ["current-rating", query],
    queryFn: async () => {
      const { data } = await getRatingToday(query);
      return data;
    },
  });
};

export default useGetRatingToday;
