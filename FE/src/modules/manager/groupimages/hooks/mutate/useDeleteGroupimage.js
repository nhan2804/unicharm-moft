import { deleteGroupimage } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useDeleteGroupimage = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (_id) => {
      return await deleteGroupimage(_id);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['groupimages'])
    }
  });
};

export default useDeleteGroupimage;
