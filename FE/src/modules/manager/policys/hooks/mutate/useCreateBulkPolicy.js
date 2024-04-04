import { createBulkPolicy } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useCreateBulkPolicy = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await createBulkPolicy(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['policys'])
    }
  });
};

export default useCreateBulkPolicy;
