import { overviewPolicy } from "@modules/staff/services/checkin";
import { useQuery } from "react-query";

const useOverviewPolicy = (search) => {
  return useQuery(["overview-policy", search], async () => {
    const data = await overviewPolicy(search);
    return data;
  });
};

export default useOverviewPolicy;
