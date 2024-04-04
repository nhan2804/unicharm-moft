import { createNotification } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useCreateNotification = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await createNotification(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['notifications'])
    }
  });
};

export default useCreateNotification;
