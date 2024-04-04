import { deleteBulkStore } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useDeleteBulkStore = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await deleteBulkStore(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['stores'])
    }
  });
};

export default useDeleteBulkStore;
