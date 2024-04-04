import { createBulkStore } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useCreateBulkStore = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await createBulkStore(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['stores'])
    }
  });
};

export default useCreateBulkStore;
