import { getGroupimage } from "../../services/index";
import { useQuery } from "react-query";

const useGetGroupimage = (query) => {
  return useQuery({
    queryKey:["groupimages",query],
    queryFn:async () => {
      return await getGroupimage(query);
    }
  });
};

export default useGetGroupimage;
