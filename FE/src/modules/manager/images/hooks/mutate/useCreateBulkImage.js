import { createBulkImage } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useCreateBulkImage = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await createBulkImage(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['images'])
    }
  });
};

export default useCreateBulkImage;
