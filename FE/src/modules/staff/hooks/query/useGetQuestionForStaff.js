import { getQuestionForStaff } from "@modules/staff/services/quesiton-submit";
import { useQuery } from "react-query";

const useGetQuestionForStaff = (query) => {
  return useQuery({
    queryKey: ["questions-staff", query],
    queryFn: async () => {
      return await getQuestionForStaff(query);
    },
  });
};

export default useGetQuestionForStaff;
