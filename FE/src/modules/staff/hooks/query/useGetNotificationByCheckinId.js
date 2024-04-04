import { findAnnoucementByCheckin } from "@modules/staff/services/checkin";
import { useQuery } from "react-query";

const useGetNotificationByCheckinId = (checkinId, query) => {
  return useQuery({
    queryKey: ["current-notification", checkinId, query],
    queryFn: async () => {
      return await findAnnoucementByCheckin(checkinId, query);
    },
  });
};

export default useGetNotificationByCheckinId;
