import { getImage } from "../../services/index";
import { useQuery } from "react-query";

const useGetImage = (query) => {
  return useQuery({
    queryKey:["images",query],
    queryFn:async () => {
      return await getImage(query);
    }
  });
};

export default useGetImage;
