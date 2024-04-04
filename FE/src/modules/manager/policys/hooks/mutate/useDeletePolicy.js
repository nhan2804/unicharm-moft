import { deletePolicy } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useDeletePolicy = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (_id) => {
      return await deletePolicy(_id);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['policys'])
    }
  });
};

export default useDeletePolicy;
