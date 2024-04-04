import { showGroupimage } from "../../services/index";
import { useQuery } from "react-query";

const useShowGroupimage = (query) => {
  return useQuery(["detail-groupimages",query], async () => {
    return await showGroupimage(query);
  });
};

export default useShowGroupimage;
