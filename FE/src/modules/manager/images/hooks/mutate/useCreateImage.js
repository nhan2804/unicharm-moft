import { createImage } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useCreateImage = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await createImage(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['images'])
    }
  });
};

export default useCreateImage;
