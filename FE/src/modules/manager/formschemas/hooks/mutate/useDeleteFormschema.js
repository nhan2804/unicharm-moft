import { deleteFormschema } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useDeleteFormschema = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (_id) => {
      return await deleteFormschema(_id);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['formschemas'])
    }
  });
};

export default useDeleteFormschema;
