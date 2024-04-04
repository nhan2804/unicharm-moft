import { createBulkGroupimage } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useCreateBulkGroupimage = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await createBulkGroupimage(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['groupimages'])
    }
  });
};

export default useCreateBulkGroupimage;
