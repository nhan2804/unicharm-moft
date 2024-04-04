import { deleteBulkNotification } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useDeleteBulkNotification = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await deleteBulkNotification(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['notifications'])
    }
  });
};

export default useDeleteBulkNotification;
