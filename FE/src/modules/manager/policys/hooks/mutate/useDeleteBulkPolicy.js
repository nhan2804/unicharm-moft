import { deleteBulkPolicy } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useDeleteBulkPolicy = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await deleteBulkPolicy(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['policys'])
    }
  });
};

export default useDeleteBulkPolicy;
