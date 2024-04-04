import { createPolicy } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useCreatePolicy = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await createPolicy(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['policys'])
    }
  });
};

export default useCreatePolicy;
