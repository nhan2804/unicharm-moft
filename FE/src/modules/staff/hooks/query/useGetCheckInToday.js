import { getCheckIns } from "@modules/staff/services/checkin";
import { useQuery } from "react-query";

const useGetCheckIn = (placeId) => {
  return useQuery(["checkins", placeId], async () => {
    const data = await getCheckIns(placeId);
    return data;
  });
};

export default useGetCheckIn;
