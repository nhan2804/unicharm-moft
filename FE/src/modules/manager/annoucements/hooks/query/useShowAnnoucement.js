import { showAnnoucement } from "../../services/index";
import { useQuery } from "react-query";

const useShowAnnoucement = (query) => {
  return useQuery(["detail-annoucements",query], async () => {
    return await showAnnoucement(query);
  });
};

export default useShowAnnoucement;
