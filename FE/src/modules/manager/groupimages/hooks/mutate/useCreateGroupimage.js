import { createGroupimage } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useCreateGroupimage = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await createGroupimage(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['groupimages'])
    }
  });
};

export default useCreateGroupimage;
