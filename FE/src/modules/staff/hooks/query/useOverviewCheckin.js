import { overviewCheckin } from "@modules/staff/services/checkin";
import { useQuery } from "react-query";

const useOverviewCheckin = (query) => {
  return useQuery(["overview-checkin", query], async () => {
    const data = await overviewCheckin(undefined, query);
    return data;
  });
};

export default useOverviewCheckin;
