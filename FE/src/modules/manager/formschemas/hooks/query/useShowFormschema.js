import { showFormschema } from "../../services/index";
import { useQuery } from "react-query";

const useShowFormschema = (query) => {
  return useQuery(["detail-formschemas",query], async () => {
    return await showFormschema(query);
  });
};

export default useShowFormschema;
