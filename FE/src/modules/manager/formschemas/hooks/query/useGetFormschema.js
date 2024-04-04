import { getFormschema } from "../../services/index";
import { useQuery } from "react-query";

const useGetFormschema = (query) => {
  return useQuery({
    queryKey:["formschemas",query],
    queryFn:async () => {
      return await getFormschema(query);
    }
  });
};

export default useGetFormschema;
