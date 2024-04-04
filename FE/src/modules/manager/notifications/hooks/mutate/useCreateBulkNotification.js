import { createBulkNotification } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useCreateBulkNotification = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await createBulkNotification(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['notifications'])
    }
  });
};

export default useCreateBulkNotification;
