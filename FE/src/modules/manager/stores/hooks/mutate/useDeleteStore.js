import { deleteStore } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useDeleteStore = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (_id) => {
      return await deleteStore(_id);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['stores'])
    }
  });
};

export default useDeleteStore;
