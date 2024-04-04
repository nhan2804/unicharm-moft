import { deleteBulkGroupimage } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useDeleteBulkGroupimage = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await deleteBulkGroupimage(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['groupimages'])
    }
  });
};

export default useDeleteBulkGroupimage;
