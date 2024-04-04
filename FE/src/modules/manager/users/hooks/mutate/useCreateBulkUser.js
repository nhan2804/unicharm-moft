import { createBulkUser } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useCreateBulkUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await createBulkUser(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['users'])
    }
  });
};

export default useCreateBulkUser;
