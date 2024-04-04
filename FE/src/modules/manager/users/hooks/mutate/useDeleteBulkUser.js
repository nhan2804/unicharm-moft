import { deleteBulkUser } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useDeleteBulkUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await deleteBulkUser(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['users'])
    }
  });
};

export default useDeleteBulkUser;
