import { deleteBulkImage } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useDeleteBulkImage = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await deleteBulkImage(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['images'])
    }
  });
};

export default useDeleteBulkImage;
