import { showDepartment } from "../../services/index";
import { useQuery } from "react-query";

const useShowDepartment = (query) => {
  return useQuery(
    ["detail-departments", query],
    async () => {
      return await showDepartment(query);
    },
    {
      enabled: !!query,
    }
  );
};

export default useShowDepartment;
