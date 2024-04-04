import { getDepartment } from "../../services/index";
import { useQuery } from "react-query";

const useGetDepartment = (query) => {
  return useQuery({
    queryKey: ["departments", query],
    queryFn: async () => {
      return await getDepartment(query);
    },
    refetchOnMount: false,
  });
};

export default useGetDepartment;
