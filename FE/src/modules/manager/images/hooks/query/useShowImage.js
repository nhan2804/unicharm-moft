import { showImage } from "../../services/index";
import { useQuery } from "react-query";

const useShowImage = (query) => {
  return useQuery(["detail-images",query], async () => {
    return await showImage(query);
  });
};

export default useShowImage;
