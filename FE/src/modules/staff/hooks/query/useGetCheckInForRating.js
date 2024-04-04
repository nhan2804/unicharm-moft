import { getCheckInTodayForRating } from "@modules/staff/services/checkin";
import { useQuery } from "react-query";

const useGetCheckInForRating = (placeId, query) => {
  return useQuery(["checkins-rating", placeId, query], async () => {
    const data = await getCheckInTodayForRating(placeId, query);
    return data;
  });
};

export default useGetCheckInForRating;
