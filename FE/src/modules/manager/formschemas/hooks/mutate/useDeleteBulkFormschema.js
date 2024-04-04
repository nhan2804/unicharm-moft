import { deleteBulkFormschema } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useDeleteBulkFormschema = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await deleteBulkFormschema(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['formschemas'])
    }
  });
};

export default useDeleteBulkFormschema;
