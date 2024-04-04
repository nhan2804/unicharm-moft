import { showNotification } from "../../services/index";
import { useQuery } from "react-query";

const useShowNotification = (query) => {
  return useQuery(["detail-notifications",query], async () => {
    return await showNotification(query);
  });
};

export default useShowNotification;
